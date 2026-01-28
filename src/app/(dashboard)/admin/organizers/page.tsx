'use client'

import React, {useCallback, useMemo, useState} from 'react'
import SidebarLayout from '../../../../components/layouts/SidebarLayout'
import GlassCard from '../../../../components/GlassCard'
import DataTable, {type DataTableColumn} from '../../../../components/DataTable'
import {useTableSearch} from '../../../../hooks/useTableSearch'
import {exportToCsv} from '@lib/csv'
import HTTP from '@lib/HTTP'
import {cn, formatDate, getCookie, getEndpoint, getErrorMessage, setCookie} from '@lib/utils'
import type {ApiData} from '@lib/types'
import AdminOrganizersShimmer from '../../../../components/dashboard/AdminOrganizersShimmer'
import { errorToast, successToast } from '@components/Toast'

type AdminOrganizer = {
    id: string
    business_name: string
    email: string
    phone: any
    created_at: string
    status: string
}

export interface User {
    id: string
    email: string
    full_name: string
    business_name: string
    completed_profile: number
    avatar: any
    auth_provider: string
    role: string
    country: string
    phone_number: string
    account_state: string
    email_verified_at: string
    created_at: string
    updated_at: string
}

type OrganizerRow = {
    id: string
    businessName: string
    email: string
    phone: string
    createdAt: string
    status: string
    isActive: boolean
}

function pillClass(active: boolean) {
    return active
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
        : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'
}

function toOrganizerRow(raw: AdminOrganizer): OrganizerRow {
    const status = String(raw?.status ?? '')
    const s = status.toLowerCase().trim()
    const isActive = s === 'active' || s === 'enabled' || s === 'approved' || s === 'verified'

    return {
        id: String(raw?.id ?? ''),
        businessName: String(raw?.business_name ?? '—'),
        email: String(raw?.email ?? '—'),
        phone: raw?.phone == null ? '—' : String(raw.phone),
        createdAt: String(raw?.created_at ?? new Date().toISOString()),
        status: status || '—',
        isActive,
    }
}

async function fetchOrganizers(): Promise<OrganizerRow[]> {
    const resp = await HTTP<ApiData<AdminOrganizer[]>, undefined>({
        url: getEndpoint('/dashboard/admin/organizers'),
        method: 'get',
    })

    if (!resp.ok || !resp.data) {
        throw resp.error
    }

    const list = Array.isArray(resp.data.data) ? resp.data.data : []
    return list.map(toOrganizerRow)
}

export default function AdminOrganizersPage() {
    const [rows, setRows] = useState<OrganizerRow[]>([])
    const [loading, setLoading] = useState(true)
    const [actionId, setActionId] = useState<string | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError(null)

        try {
            const data = await fetchOrganizers()
            setRows(data)
        } catch (e) {
            console.error(e)
            setRows([])
            setLoadError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        void load()
    }, [load])

    const {query, setQuery, filtered} = useTableSearch(rows, (row: OrganizerRow, q: string) => {
        const hay = `${row.businessName} ${row.email} ${row.phone} ${row.status} ${row.isActive ? 'active' : 'inactive'}`.toLowerCase()
        return hay.includes(q)
    })

    const columns = useMemo((): DataTableColumn<OrganizerRow>[] => {
        return [
            {
                key: 'businessName',
                header: 'Business name',
                render: (r: OrganizerRow) => (
                    <div className="min-w-[160px]">
                        <div className="font-semibold text-gray-900 dark:text-white">{r.businessName}</div>
                        <div className="mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">
                            {r.isActive ? 'Active' : r.status || 'Inactive'}
                        </div>
                    </div>
                ),
            },
            {
                key: 'email',
                header: 'Email',
                className: 'whitespace-nowrap',
                render: (r: OrganizerRow) => (
                    <a className="text-sky-700 dark:text-sky-300 hover:underline" href={`mailto:${r.email}`}>
                        {r.email}
                    </a>
                ),
            },
            {
                key: 'phone',
                header: 'Phone',
                className: 'whitespace-nowrap',
                render: (r: OrganizerRow) => <span className="text-sm">{r.phone}</span>,
            },
            {
                key: 'createdAt',
                header: 'Date joined',
                className: 'whitespace-nowrap',
                render: (r: OrganizerRow) => (
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark">{formatDate(r.createdAt)}</span>
                ),
            },
            {
                key: 'actions',
                header: 'Actions',
                className: 'whitespace-nowrap',
                render: (r: OrganizerRow) => {
                    const busy = actionId === r.id
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void onLoginAs(r)}
                                className={cn(
                                    'rounded-lg bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                                    busy ? 'opacity-60 cursor-not-allowed' : ''
                                )}
                            >
                                Login as
                            </button>

                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void onToggleActive(r)}
                                className={cn(
                                    'rounded-lg px-3 py-1.5 text-xs font-semibold',
                                    r.isActive
                                        ? 'bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                                        : 'bg-brand-teal text-white hover:opacity-95',
                                    busy ? 'opacity-60 cursor-not-allowed' : ''
                                )}
                            >
                                {r.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    )
                },
            },
        ]

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionId])

    async function onExport() {
        const exportRows = filtered.map((r: OrganizerRow) => ({
            businessName: r.businessName,
            email: r.email,
            phone: r.phone,
            dateJoined: formatDate(r.createdAt),
            status: r.isActive ? 'Active' : r.status || 'Inactive',
        }))

        exportToCsv(`organizers-${new Date().toISOString().slice(0, 10)}`, exportRows, [
            {key: 'businessName', header: 'Business name'},
            {key: 'email', header: 'Email'},
            {key: 'phone', header: 'Phone'},
            {key: 'dateJoined', header: 'Date joined'},
            {key: 'status', header: 'Status'},
        ])
    }

    async function onToggleActive(r: OrganizerRow) {
        setActionId(r.id)

        // Best effort: the backend expects "status" in the body. We'll toggle between "active" and "inactive".
        const nextStatus = r.isActive ? 'suspended' : 'active'

        try {
            const resp = await HTTP<ApiData<unknown>, {status: string}>({
                url: getEndpoint(`/dashboard/admin/organizer/${encodeURIComponent(r.id)}/change-status`),
                method: 'put',
                data: {status: nextStatus},
            })

            if (!resp.ok) {
                errorToast(getErrorMessage(resp.error))
                return
            }

            // Optimistic update for snappy UI.
            setRows((prev) =>
                prev.map((x) =>
                    x.id === r.id
                        ? {
                              ...x,
                              status: nextStatus,
                              isActive: nextStatus === 'active',
                          }
                        : x
                )
            )

            successToast(`Organizer ${nextStatus === 'active' ? 'activated' : 'deactivated'} successfully.`)
        } catch (e) {
            console.error(e)
            errorToast(getErrorMessage(e))
        } finally {
            setActionId(null)
        }
    }

    async function onLoginAs(r: OrganizerRow) {
        setActionId(r.id)

        try {
            const resp = await HTTP<ApiData<{token: string; user: User}>, undefined>({
                url: getEndpoint(`/dashboard/admin/impersonate/${encodeURIComponent(r.id)}`),
                method: 'post',
            })

            if (!resp.ok || !resp.data) {
                errorToast(getErrorMessage(resp.error))
                return
            }

            const {token, user} = resp.data.data ?? ({} as any)
            if (!token || !user) {
                errorToast('Impersonation failed: missing token or user')
                return
            }

            setCookie('admin_token', getCookie('token'))
            setCookie('token', String(token))
            setCookie('user', encodeURIComponent(JSON.stringify(user)))
            setCookie('role', 'organizer')

            window.location.href = '/organizer/dashboard'
        } catch (e) {
            console.error(e)
            errorToast(getErrorMessage(e))
        } finally {
            setActionId(null)
        }
    }

    return (
        <SidebarLayout>
            <div className="w-full max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Organizers</h1>
                        <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                            Manage organizer accounts and access.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void load()}
                            disabled={loading}
                            className={cn(
                                'rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20',
                                loading ? 'opacity-60 cursor-not-allowed' : ''
                            )}
                        >
                            {loading ? 'Refreshing…' : 'Refresh'}
                        </button>

                        <button
                            type="button"
                            onClick={() => void onExport()}
                            disabled={loading || rows.length === 0}
                            className={cn(
                                'rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white',
                                loading || rows.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                            )}
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {loading ? (
                    <AdminOrganizersShimmer />
                ) : loadError ? (
                    <GlassCard className="mt-6 p-5">
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                            <div className="text-sm font-semibold text-rose-700 dark:text-rose-200">Could not load organizers</div>
                            <div className="mt-1 text-sm text-rose-700/90 dark:text-rose-200/90">{loadError}</div>

                            <div className="mt-3 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => void load()}
                                    className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ) : (
                    <GlassCard className="mt-6 p-5">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search organizers by name, email, phone…"
                                    className="w-full sm:w-[360px] rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                />

                                <div className="inline-flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                            pillClass(true)
                                        )}
                                    >
                                        All
                                    </span>
                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                            pillClass(false)
                                        )}
                                    >
                                        Active
                                    </span>
                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                            pillClass(false)
                                        )}
                                    >
                                        Inactive
                                    </span>
                                </div>
                            </div>

                            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                Showing <span className="font-semibold">{filtered.length}</span> of{' '}
                                <span className="font-semibold">{rows.length}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <DataTable<OrganizerRow>
                                columns={columns}
                                rows={filtered}
                                rowKey={(r: OrganizerRow) => r.id}
                                emptyTitle="No organizers"
                                emptyDescription="When organizers sign up, they’ll appear here."
                            />
                        </div>
                    </GlassCard>
                )}
            </div>
        </SidebarLayout>
    )
}
