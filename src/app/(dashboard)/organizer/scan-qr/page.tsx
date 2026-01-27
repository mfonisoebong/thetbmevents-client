'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import { cn, getEndpoint, getErrorMessage } from '@lib/utils'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  XCircleIcon,
  CameraIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import GlassCard from "../../../../components/GlassCard";
import HTTP from '@lib/HTTP'
import type { ApiData } from '@lib/types'

type ValidationStatus = 'success' | 'used' | 'invalid'

type ScanQrResult = {
  attendee_name: string
  ticket_name: string
  event_name: string
}

type ScanResult = {
  raw: string
  decodedId: string | null
  status: ValidationStatus
  details?: ScanQrResult | null
}

function base64Decode(input: string): string | null {
  // The payload is produced by btoa(), so it should be standard base64.
  // Some scanners may hand us base64url-ish strings or include whitespace.
  try {
    const cleaned = input.trim().replace(/\s+/g, '')

    // Support base64url variants just in case.
    const normalized = cleaned.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

    return atob(padded)
  } catch {
    return null
  }
}

function pillClass(status: ValidationStatus) {
  if (status === 'success') return 'bg-emerald-100 text-emerald-800'
  if (status === 'used') return 'bg-amber-100 text-amber-800'
  return 'bg-rose-100 text-rose-800'
}

function StatusIcon({ status }: { status: ValidationStatus }) {
  if (status === 'success') return <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
  if (status === 'used') return <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
  return <XCircleIcon className="w-6 h-6 text-rose-600" />
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      // Treat small viewports + touch as mobile enough.
      const hasTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints ?? 0) > 0
      const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
      setIsMobile(Boolean(hasTouch && small))
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}

type StartMode = 'camera' | 'upload' | 'paste'

type QrLib = {
  Html5Qrcode: any
  Html5QrcodeSupportedFormats?: any
}

function canUseCameraStreaming() {
  if (typeof window === 'undefined') return false

  const isSecure = window.isSecureContext || window.location.hostname === 'localhost'
  const hasMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

  // iOS Safari requires https and user interaction for getUserMedia.
  return isSecure && hasMedia
}

function friendlyCameraHelp(): string[] {
  const lines: string[] = []

  if (typeof window === 'undefined') return lines

  const isSecure = window.isSecureContext || window.location.hostname === 'localhost'
  if (!isSecure) {
    lines.push('Open this page over HTTPS (camera access is blocked on non-secure origins).')
  }

  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    lines.push('Your browser does not support live camera capture (getUserMedia). Try Chrome on Android or Safari on iOS 15+.')
  }

  // Always add a general hint.
  lines.push('Make sure camera permission is allowed for this site.')
  lines.push('If your browser blocks live scanning, use “Upload QR image” or “Paste code”.')

  return lines
}

export default function OrganizerScanQrPage() {
  const isMobile = useIsMobile()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scannerError, setScannerError] = useState<string | null>(null)
  const [scannerHelp, setScannerHelp] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [startMode, setStartMode] = useState<StartMode>('camera')
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const scannerRef = useRef<any>(null)
  const qrLibRef = useRef<QrLib | null>(null)
  const regionId = 'tbm-qr-reader'

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pasteValue, setPasteValue] = useState('')

  const checkIn = useCallback(async (decodedId: string) => {
    setIsCheckingIn(true)

    const resp = await HTTP<ApiData<ScanQrResult>, undefined>({
      url: getEndpoint(`/dashboard/organizer/check-in-attendee/${encodeURIComponent(decodedId)}`),
      method: 'get',
    })

    if (!resp.ok) {
      const msg = getErrorMessage(resp.error)
      const lower = msg.toLowerCase()

      // Server can return 404 (not found) or 400 (already checked in)
      const status: ValidationStatus =
        lower.includes('already') || lower.includes('checked') || lower.includes('used')
          ? 'used'
          : 'invalid'

      setScanResult({ raw: '', decodedId, status, details: null })
      setIsModalOpen(true)
      setIsCheckingIn(false)
      return
    }

    setScanResult({ raw: '', decodedId, status: 'success', details: resp.data?.data ?? null })
    setIsModalOpen(true)
    setIsCheckingIn(false)
  }, [])

  async function stopScanner() {
    const inst = scannerRef.current
    if (!inst) return

    try {
      if (typeof inst.isScanning === 'boolean' && !inst.isScanning) return
      await inst.stop?.()
    } catch {
      // ignore
    }

    try {
      await inst.clear?.()
    } catch {
      // ignore
    }

    scannerRef.current = null
    setIsScanning(false)
  }

  async function ensureQrLib(): Promise<QrLib> {
    if (qrLibRef.current) return qrLibRef.current
    const mod = (await import('html5-qrcode')) as any
    const lib: QrLib = {
      Html5Qrcode: mod.Html5Qrcode,
      Html5QrcodeSupportedFormats: mod.Html5QrcodeSupportedFormats,
    }
    qrLibRef.current = lib
    return lib
  }

  async function startScanner() {
    setScannerError(null)
    setScannerHelp([])

    if (!isMobile) {
      setScannerError('This feature is only available on mobile phones.')
      setScannerHelp(['Open this page on your phone to use the camera scanner.'])
      return
    }

    // Important: some browsers show “Camera streaming not supported by browser”.
    // We pre-check common causes and provide fallbacks.
    if (!canUseCameraStreaming()) {
      setScannerError('Camera streaming not supported in this browser/environment.')
      setScannerHelp(friendlyCameraHelp())
      setStartMode('upload')
      setIsScanning(false)
      return
    }

    try {
      const { Html5Qrcode } = await ensureQrLib()

      await stopScanner()

      const inst = new Html5Qrcode(regionId)
      scannerRef.current = inst
      setIsScanning(true)

      // Try multiple strategies:
      // 1) pick the "back" camera if possible
      // 2) fallback to facingMode
      const devices = (await Html5Qrcode.getCameras?.()) ?? []
      const back = devices.find((d: any) => /back|rear|environment/i.test(String(d.label ?? '')))

      const cameraConfig = back?.id ? { deviceId: { exact: back.id } } : { facingMode: 'environment' }

      await inst.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: true,
        },
        async (decodedText: string) => {
          await stopScanner()
          onDecoded(decodedText)
        },
        () => {
          // ignore per-frame failures
        }
      )

      setStartMode('camera')
    } catch (e: any) {
      console.error('scanner start error', e)
      setIsScanning(false)

      // Provide a more helpful error and immediately offer upload fallback.
      const msg = String(e?.message ?? '').trim() || 'Unable to start camera scanner.'
      setScannerError(msg)
      setScannerHelp(friendlyCameraHelp())
      setStartMode('upload')
    }
  }

  async function onUploadFile(file: File) {
    try {
      const { Html5Qrcode } = await ensureQrLib()
      await stopScanner()

      const inst = new Html5Qrcode(regionId)
      scannerRef.current = inst
      setIsScanning(false)

      // html5-qrcode supports scanning from image file.
      const decodedText = await inst.scanFile(file, true)
      await inst.clear?.()
      scannerRef.current = null

      onDecoded(decodedText)
    } catch (e: any) {
      console.error('scan file error', e)
      setScannerError(e?.message ?? 'Unable to scan that image. Try a clearer photo of the QR code.')
      setScannerHelp(['Try taking another picture with better lighting and ensure the QR fills the frame.'])
    }
  }

  function onDecoded(raw: string) {
    const decodedId = base64Decode(raw)

    if (!decodedId) {
      setScanResult({ raw, decodedId: null, status: 'invalid', details: null })
      setIsModalOpen(true)
      return
    }

    setScanResult({ raw, decodedId, status: 'invalid', details: null })
    void checkIn(decodedId)
  }

  async function onScanAgain() {
    setIsModalOpen(false)
    setScanResult(null)
    await startScanner()
  }

  useEffect(() => {
    if (!isMobile) return
    // Auto-start only if camera streaming is supported; otherwise we show upload fallback.
    if (canUseCameraStreaming()) {
      startScanner()
    } else {
      setScannerError('Camera streaming not supported in this browser/environment.')
      setScannerHelp(friendlyCameraHelp())
      setStartMode('upload')
    }

    return () => {
      stopScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  return (
    <SidebarLayout>
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Scan QR</h1>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Scan attendee tickets and validate them instantly.
          </p>
        </div>

        {!isMobile ? (
          <GlassCard className="mt-6 p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2">
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Mobile only</div>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                  Open this page on your phone to scan tickets.
                </p>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="mt-6 space-y-4">
            <GlassCard className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Scanner</div>
                    <div className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                      Scan tickets via camera, upload an image of a QR code, or paste the encoded string.
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStartMode('camera')}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border',
                        startMode === 'camera'
                          ? 'bg-brand-yellow text-white border-brand-yellow'
                          : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                      )}
                    >
                      <CameraIcon className="w-5 h-5" />
                      Camera
                    </button>

                    <button
                      type="button"
                      onClick={() => setStartMode('upload')}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border',
                        startMode === 'upload'
                          ? 'bg-brand-yellow text-white border-brand-yellow'
                          : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                      )}
                    >
                      <ArrowUpTrayIcon className="w-5 h-5" />
                      Upload QR image
                    </button>

                    <button
                      type="button"
                      onClick={() => setStartMode('paste')}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border',
                        startMode === 'paste'
                          ? 'bg-brand-yellow text-white border-brand-yellow'
                          : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                      )}
                    >
                      <QrCodeIcon className="w-5 h-5" />
                      Paste ID
                    </button>
                  </div>
                </div>

                {scannerError ? (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-700 dark:text-rose-200">
                    <div className="font-semibold">{scannerError}</div>
                    {scannerHelp.length ? (
                      <ul className="mt-2 list-disc pl-5 space-y-1 text-xs">
                        {scannerHelp.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {startMode === 'camera' ? (
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={startScanner}
                      className="w-fit rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                    >
                      {isScanning ? 'Scanning...' : 'Start camera scan'}
                    </button>

                    <div>
                      <div
                        id={regionId}
                        className="w-full overflow-hidden rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10"
                      />
                      <div className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                        If the camera doesn’t load, confirm site permissions and try the upload/paste options.
                      </div>
                    </div>
                  </div>
                ) : null}

                {startMode === 'upload' ? (
                  <div className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Upload a QR image</div>
                    <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                      Upload a screenshot/photo of the QR code to check in an attendee.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="mt-4 block w-full text-sm text-text-muted-light dark:text-text-muted-dark file:mr-4 file:rounded-xl file:border-0 file:bg-brand-yellow file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-95"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) onUploadFile(f)
                        e.currentTarget.value = ''
                      }}
                    />

                    <div className="mt-4">
                      <div
                        id={regionId}
                        className="w-full overflow-hidden rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10"
                      />
                    </div>
                  </div>
                ) : null}

                {startMode === 'paste' ? (
                  <div className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Paste ticket ID</div>
                    <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                      Paste the ticket ID. We decode it and check the attendee in.
                    </p>

                    <textarea
                      value={pasteValue}
                      onChange={(e) => setPasteValue(e.target.value)}
                      rows={4}
                      placeholder="Paste the encoded ticket ID here"
                      className="mt-3 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPasteValue('')}
                        className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => checkIn(pasteValue)}
                        className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                        disabled={!pasteValue.trim() || isCheckingIn}
                      >
                        {isCheckingIn ? 'Checking in...' : 'Check in attendee'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </GlassCard>
          </div>
        )}

        <Dialog
          open={isModalOpen}
          onClose={(open) => {
            if (!open) setIsModalOpen(false)
          }}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-lg font-extrabold text-gray-900 dark:text-white">Scan result</DialogTitle>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                    {isCheckingIn ? 'Checking in attendee...' : 'Ticket validation result.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {scanResult ? <StatusIcon status={scanResult.status} /> : null}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg p-2 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {scanResult ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Attendee name</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white break-all font-mono">
                      {scanResult.details?.attendee_name ?? '—'}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Event  — Ticket</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white break-all">
                      {scanResult.details ? (
                        <span>
                          <span className="font-semibold">{scanResult.details.event_name}</span>
                          <span className="text-text-muted-light dark:text-text-muted-dark"> — </span>
                          <span className="font-semibold">{scanResult.details.ticket_name}</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4">
                    <div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Validation</div>
                      <div className={cn('mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', pillClass(scanResult.status))}>
                        {scanResult.status === 'success'
                          ? 'Success — checked in'
                          : scanResult.status === 'used'
                            ? 'Already checked in'
                            : 'Not found'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Server</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Live</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      onClick={onScanAgain}
                      className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                      disabled={isCheckingIn}
                    >
                      Scan again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 text-sm text-text-muted-light dark:text-text-muted-dark">No scan result.</div>
              )}
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </SidebarLayout>
  )
}
