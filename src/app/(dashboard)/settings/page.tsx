'use client'

import React, { useMemo, useState } from 'react'
import SidebarLayout from '../../../components/layouts/SidebarLayout'
import { cn } from '@lib/utils'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

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
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
      />
    </label>
  )
}

export default function SettingsPage() {
  const initialProfile = useMemo<BusinessProfile>(
    () => ({
      businessName: 'TBM Events',
      email: 'support@tbmevents.com',
      phone: '+234 800 000 0000',
      country: 'Nigeria',
    }),
    []
  )

  const [profile, setProfile] = useState<BusinessProfile>(initialProfile)
  const [draft, setDraft] = useState<BusinessProfile>(initialProfile)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  const [showPasswords, setShowPasswords] = useState(false)

  function onStartEdit() {
    setDraft(profile)
    setIsEditingProfile(true)
  }

  function onCancelEdit() {
    setDraft(profile)
    setIsEditingProfile(false)
  }

  function onSaveProfile() {
    setProfile(draft)
    setIsEditingProfile(false)
    console.log('Save business profile', draft)
  }

  function validatePassword(pw: string) {
    // Simple, friendly demo validation.
    if (pw.length < 8) return 'Password must be at least 8 characters.'
    return null
  }

  function onChangePassword() {
    setPasswordMessage(null)

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

    // Mock server call.
    console.log('Change password', { currentPassword: '***', newPassword: '***' })

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage('Password updated successfully (demo).')
  }

  const p = isEditingProfile ? draft : profile

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
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={onStartEdit}
                  className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                >
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSaveProfile}
                    className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                  >
                    Save changes
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Business name"
                value={p.businessName}
                onChange={(v) => setDraft((d) => ({ ...d, businessName: v }))}
              />
              <Field label="Email" type="email" value={p.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} />
              <Field
                label="Phone number"
                value={p.phone}
                onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
                placeholder="+234 ..."
              />
              <Field label="Country" value={p.country} onChange={(v) => setDraft((d) => ({ ...d, country: v }))} />
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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <button type="button" onClick={onChangePassword} className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white">
                Update password
              </button>
            </div>

            <div className="mt-3 text-xs text-text-muted-light dark:text-text-muted-dark">
              Demo only: this logs to the console. Hook up your API when ready.
            </div>
          </GlassCard>
        </div>
      </div>
    </SidebarLayout>
  )
}
