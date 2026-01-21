'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import { cn } from '@lib/utils'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  XCircleIcon,
  CameraIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'
import GlassCard from "../../../../components/GlassCard";

type ValidationStatus = 'success' | 'used' | 'invalid'

type ScanResult = {
  raw: string
  decodedId: string | null
  status: ValidationStatus
}

function hashStringToNumber(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
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

function statusFromTicketId(ticketId: string): ValidationStatus {
  const mod = hashStringToNumber(ticketId) % 3
  if (mod === 0) return 'success'
  if (mod === 1) return 'used'
  return 'invalid'
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
      // Feature requirement: "only work on mobile phones".
      // We treat small viewports + touch as mobile enough for this demo.
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

  const scannerRef = useRef<any>(null)
  const qrLibRef = useRef<QrLib | null>(null)
  const regionId = 'tbm-qr-reader'

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pasteValue, setPasteValue] = useState('')

  const sample = useMemo(
    () => ({
      raw: 'OWFkNGQwZmMtYzdiYS00YTA2LWE4ODQtYWQ4MDRjNTVkY2Y2',
      decoded: '9ad4d0fc-c7ba-4a06-a884-ad804c55dcf6',
    }),
    []
  )

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
      setScannerHelp(['Open this page on your phone to use the camera scanner.', 'You can still test on desktop with “Simulate scan”.'])
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
    const status = decodedId ? statusFromTicketId(decodedId) : 'invalid'

    // Pretend we send decodedId to server for validation.
    console.log('Validate ticket id', { decodedId, status })

    setScanResult({ raw, decodedId, status })
    setIsModalOpen(true)
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
            Scan attendee tickets and validate them instantly. (Mobile-only)
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
                  This feature only works on mobile phones because it requires a camera.
                </p>
                <div className="mt-4 text-xs text-text-muted-light dark:text-text-muted-dark">
                  Tip: open this page on your phone.
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Test with sample payload</div>
              <div className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark break-all">{sample.raw}</div>
              <div className="mt-2 text-xs">
                <span className="text-text-muted-light dark:text-text-muted-dark">Decodes to: </span>
                <span className="font-mono text-gray-900 dark:text-white">{sample.decoded}</span>
              </div>

              <button
                type="button"
                onClick={() => onDecoded(sample.raw)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
              >
                <QrCodeIcon className="w-5 h-5" />
                Simulate scan
              </button>
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
                      Scan tickets via camera, upload an image of a QR code, or paste the Base64 payload.
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
                      Paste code
                    </button>

                    <button
                      type="button"
                      onClick={() => onDecoded(sample.raw)}
                      className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                    >
                      Use sample
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
                      {isScanning ? 'Scanning…' : 'Start camera scan'}
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
                      If your browser won’t stream the camera, you can upload a screenshot/photo of the QR.
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

                    {/* hidden render region for scanFile */}
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
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Paste Base64 payload</div>
                    <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                      Paste the QR string (what was encoded into the QR). We’ll decode it and validate.
                    </p>

                    <textarea
                      value={pasteValue}
                      onChange={(e) => setPasteValue(e.target.value)}
                      rows={4}
                      placeholder="e.g. OWFkNGQwZmMtYzdiYS00YTA2LWE4ODQtYWQ4MDRjNTVkY2Y2"
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
                        onClick={() => onDecoded(pasteValue)}
                        className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                        disabled={!pasteValue.trim()}
                      >
                        Decode & validate
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </GlassCard>

            {/* Keep the demo explanation card */}
            <GlassCard className="p-6">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">How validation works (demo)</div>
              <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                We decode the scanned QR (Base64 → ticket ID), then “validate with server”. For now:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-text-muted-light dark:text-text-muted-dark list-disc pl-5">
                <li>
                  <span className="font-mono">hash(id) % 3 = 0</span> → success
                </li>
                <li>
                  <span className="font-mono">hash(id) % 3 = 1</span> → used
                </li>
                <li>
                  <span className="font-mono">hash(id) % 3 = 2</span> → invalid
                </li>
              </ul>
            </GlassCard>
          </div>
        )}

        <Dialog open={isModalOpen} onClose={setIsModalOpen} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-lg font-extrabold text-gray-900 dark:text-white">Scan result</DialogTitle>
                  <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">Decoded ticket ID and validation status.</p>
                </div>
                {scanResult ? <StatusIcon status={scanResult.status} /> : null}
              </div>

              {scanResult ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Raw payload</div>
                    <div className="mt-1 text-xs text-gray-900 dark:text-white break-all font-mono">{scanResult.raw}</div>
                  </div>

                  <div className="rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 p-4">
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Ticket ID</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white break-all font-mono">
                      {scanResult.decodedId ?? 'Could not decode Base64 payload'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4">
                    <div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Validation</div>
                      <div className={cn('mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', pillClass(scanResult.status))}>
                        {scanResult.status === 'success' ? 'Success — valid ticket' : scanResult.status === 'used' ? 'Used — already checked in' : 'Invalid — not recognized'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Server</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Demo</div>
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
                      onClick={() => {
                        if (!scanResult.decodedId) return
                        navigator.clipboard?.writeText(scanResult.decodedId)
                      }}
                      className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                      disabled={!scanResult.decodedId}
                    >
                      Copy ID
                    </button>

                    <button type="button" onClick={onScanAgain} className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white">
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
