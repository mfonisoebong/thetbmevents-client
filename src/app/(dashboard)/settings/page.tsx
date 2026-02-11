'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../components/layouts/SidebarLayout'
import { cn, getEndpoint, getErrorMessage } from '@lib/utils'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import HTTP from '@lib/HTTP'
import { errorToast, successToast } from '@components/Toast'

export type AuthMeResponse = {
  id: string
  full_name: string | null
  business_name: string | null
  completed_profile: number
  avatar: string | null
  auth_provider: string
  email: string
  role: string
  country: string | null
  phone_number: string | null
  account_state: string
  created_at: string
}

type BusinessProfile = {
  businessName: string
  email: string
  phone: string
  country: string
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm shadow-sm',
        className ?? ''
      )}
    >
      {children}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      />
    </label>
  )
}

function normalizeMeToProfile(me: AuthMeResponse | null): BusinessProfile {
  return {
    businessName: me?.business_name ?? '',
    email: me?.email ?? '',
    phone: me?.phone_number ?? '',
    country: me?.country ?? '',
  }
}

export default function SettingsPage() {
  const emptyProfile = useMemo<BusinessProfile>(
    () => ({
      businessName: '',
      email: '',
      phone: '',
      country: '',
    }),
    []
  )

  const [loadingMe, setLoadingMe] = useState(true)
  const [me, setMe] = useState<AuthMeResponse | null>(null)

  const [profile, setProfile] = useState<BusinessProfile>(emptyProfile)
  const [draft, setDraft] = useState<BusinessProfile>(emptyProfile)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [changingPassword, setChangingPassword] = useState(false)

  const [showPasswords, setShowPasswords] = useState(false)

  const loadMe = useCallback(async () => {
    setLoadingMe(true)

    const resp = await HTTP<AuthMeResponse, undefined>({
      url: getEndpoint('/auth/me'),
      method: 'get',
    })

    if (!resp.ok) {
      errorToast(getErrorMessage(resp.error))
      setMe(null)
      setProfile(emptyProfile)
      setDraft(emptyProfile)
      setLoadingMe(false)
      return
    }

    const data = resp.data
    setMe(data)

    const next = normalizeMeToProfile(data)
    setProfile(next)
    setDraft(next)

    setLoadingMe(false)
  }, [emptyProfile])

  useEffect(() => {
    void loadMe()
  }, [loadMe])

  function onStartEdit() {
    setDraft(profile)
    setIsEditingProfile(true)
  }

  function onCancelEdit() {
    setDraft(profile)
    setIsEditingProfile(false)
  }

  const onSaveProfile = useCallback(async () => {
    if (savingProfile) return

    const payload = {
      business_name: draft.businessName.trim(),
      phone_number: draft.phone.trim(),
      email: draft.email.trim(),
    }

    if (!payload.business_name) {
      errorToast('Business name is required.')
      return
    }
    if (!payload.email) {
      errorToast('Email is required.')
      return
    }

    setSavingProfile(true)

    const resp = await HTTP<any, typeof payload>({
      url: getEndpoint('/auth/update-profile'),
      method: 'put',
      data: payload,
    })

    if (!resp.ok) {
      errorToast(getErrorMessage(resp.error))
      setSavingProfile(false)
      return
    }

    successToast(resp.data?.message ?? 'Profile updated successfully.')

    setProfile((p) => ({ ...p, businessName: payload.business_name, phone: payload.phone_number, email: payload.email }))
    setIsEditingProfile(false)
    setSavingProfile(false)

    // Refresh /auth/me to keep other fields in sync
    void loadMe()
  }, [draft.businessName, draft.email, draft.phone, loadMe, savingProfile])

  function validatePassword(pw: string) {
    if (pw.length < 8) return 'Password must be at least 8 characters.'
    return null
  }

  const onChangePassword = useCallback(async () => {
    setPasswordMessage(null)

    if (changingPassword) return

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Please fill in all password fields.')
      return
    }

    const err = validatePassword(newPassword)
    if (err) {
      setPasswordMessage(err)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New password and confirm password do not match.')
      return
    }

    setChangingPassword(true)

    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    }

    const resp = await HTTP<any, typeof payload>({
      url: getEndpoint('/auth/change-password'),
      method: 'post',
      data: payload,
    })

    if (!resp.ok) {
      const msg = getErrorMessage(resp.error)
      errorToast(msg)
      setPasswordMessage(msg)
      setChangingPassword(false)
      return
    }

    successToast(resp.data?.message ?? 'Password updated successfully.')

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage('Password updated successfully.')
    setChangingPassword(false)
  }, [changingPassword, confirmPassword, currentPassword, newPassword])

  const p = isEditingProfile ? draft : profile
  const profileDisabled = loadingMe || savingProfile || !isEditingProfile

  return (
    <SidebarLayout>
      <div className="w-full max-w-5xl mx-auto px-6 py-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Manage your business profile and security. (Shared for organizers and admins)
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Business Profile */}
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Business profile</h2>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                  Update your business details. Changes apply across your dashboard.
                </p>

                {me?.email ? (
                  <div className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">Signed in as {me.email}</div>
                ) : null}
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={onStartEdit}
                  disabled={loadingMe || savingProfile}
                  className={cn(
                    'rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white',
                    (loadingMe || savingProfile) && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {loadingMe ? 'Loading…' : 'Edit'}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    disabled={savingProfile}
                    className={cn(
                      'rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                      savingProfile && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSaveProfile}
                    disabled={savingProfile}
                    className={cn('rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white', savingProfile && 'opacity-60 cursor-not-allowed')}
                  >
                    {savingProfile ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Business name"
                value={p.businessName}
                onChange={(v) => setDraft((d) => ({ ...d, businessName: v }))}
                disabled={profileDisabled}
              />
              <Field
                label="Email"
                type="email"
                value={p.email}
                onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                disabled={profileDisabled}
              />
              <Field
                label="Phone number"
                value={p.phone}
                onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
                placeholder="+234 ..."
                disabled={profileDisabled}
              />
              <Field label="Country" value={p.country} onChange={() => {}} disabled={true} />
            </div>

            {!isEditingProfile ? (
              <div className="mt-4 text-xs text-text-muted-light dark:text-text-muted-dark">
                Click <span className="font-semibold">Edit</span> to update these fields.
              </div>
            ) : null}
          </GlassCard>

          {/* Change Password */}
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Change password</h2>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                  Choose a strong password to keep your account safe.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswords((p) => !p)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
              >
                {showPasswords ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                {showPasswords ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className={cn('mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4', changingPassword && 'opacity-60 pointer-events-none')}>
              <Field
                label="Current password"
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <div className="hidden sm:block" />
              <Field
                label="New password"
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={setNewPassword}
              />
              <Field
                label="Confirm new password"
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            {passwordMessage ? (
              <div
                className={cn(
                  'mt-4 rounded-xl border p-3 text-sm',
                  passwordMessage.toLowerCase().includes('success')
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-200'
                )}
              >
                {passwordMessage}
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={onChangePassword}
                disabled={changingPassword}
                className={cn('rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white', changingPassword && 'opacity-60 cursor-not-allowed')}
              >
                {changingPassword ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </SidebarLayout>
  )
}
