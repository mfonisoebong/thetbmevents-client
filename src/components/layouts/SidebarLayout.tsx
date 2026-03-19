import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Sidebar from "../dashboard/Sidebar";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {deleteCookie, getEndpoint, getErrorMessage, getInitials, setCookie} from "@lib/utils";
import HTTP from "@lib/HTTP";
import useUser from "../../hooks/useUser";
import Link from "next/link";

const userNavigation = [
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '#' },
] satisfies ReadonlyArray<{ name: string; href: string }>

type SidebarLayoutProps = {
  children: ReactNode
}

export function logout() {
  HTTP({url: getEndpoint('/auth/logout')}).then(() => {
    deleteCookie('token');
    deleteCookie('role');
    deleteCookie('user');

    window.location.href = '/login';
  });
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false)

  function switchToAdmin() {
    setCookie('token', adminToken || '');
    setCookie('role', 'admin');
    deleteCookie('admin_token');

    window.location.href = '/admin/organizers';
  }

  const { name, role, adminToken, user } = useUser();
  const isEmailUnverified = role === 'organizer' && user?.email_verified_at == null;

  async function resendVerificationLink() {
    setVerificationError(null);

    const email = user?.email?.trim();
    if (!email) {
      setVerificationError('Unable to resend verification link because your email is missing.');
      return;
    }

    setResendLoading(true);

    const response = await HTTP<{ message?: string }, { email: string }>({
      url: getEndpoint('/auth/resend-email-verification-link'),
      data: { email },
    });

    if (response.ok) {
      setVerificationDialogOpen(true);
    } else {
      setVerificationError(getErrorMessage(response.error));
    }

    setResendLoading(false);
  }

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              <Sidebar/>
            </DialogPanel>
          </div>
        </Dialog>

        <Dialog open={verificationDialogOpen} onClose={setVerificationDialogOpen} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">Check your email</DialogTitle>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                We sent a new verification link to <strong>{user?.email ?? 'your email address'}.</strong> If you don't see the email, please check your spam folder or try resending the verification link.
              </p>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setVerificationDialogOpen(false)}
                  className="rounded-md bg-brand-yellow px-4 py-2 text-sm font-semibold text-gray-900 hover:opacity-90"
                >
                  Got it
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <Sidebar/>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-16 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
              <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-white">
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden dark:bg-gray-800" />

              <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <div className="rounded-full bg-gray-100 p-3 text-sm font-bold flex items-center justify-center dark:text-text-light">{getInitials(name || '')}</div>
                      <span className="hidden lg:flex lg:items-center">
                        <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900 dark:text-white">
                          {name}
                        </span>
                        <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                      </span>
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-surface-dark dark:ring-white/10"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            href={item.href}
                            className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none dark:text-white dark:data-[focus]:bg-gray-800"
                            {...item.name === 'Sign out' ? {onClick: logout} : {}}
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      ))}

                      {adminToken && role === 'organizer' && (
                          <MenuItem>
                            <div
                                className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none dark:text-white dark:data-[focus]:bg-gray-800 cursor-pointer"
                                onClick={switchToAdmin}
                            >
                              Switch to Admin
                            </div>
                          </MenuItem>
                      )}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>

            {isEmailUnverified && (
              <div className="border-t border-orange-200 bg-orange-50 px-4 py-2 sm:px-6 lg:px-8 dark:border-orange-900/40 dark:bg-orange-950/30">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-orange-900 dark:text-orange-200">
                    Your email is not verified yet. Please verify your email to keep your account secure.
                  </p>
                  <button
                    type="button"
                    onClick={resendVerificationLink}
                    disabled={resendLoading}
                    className="inline-flex items-center justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {resendLoading ? 'Sending...' : 'Resend verification link'}
                  </button>
                </div>
                {verificationError && (
                  <p className="mt-2 text-sm text-red-700 dark:text-red-300">{verificationError}</p>
                )}
              </div>
            )}
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
