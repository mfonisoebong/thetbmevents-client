"use client"

import {useEffect, useState} from "react";
import type {ComponentType, SVGProps} from "react";
import {classNames} from "@lib/utils";
import {usePathname} from "next/navigation";

import {
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  HomeIcon,
  UsersIcon,
  TagIcon,
  QrCodeIcon,
  TicketIcon,
  GlobeAltIcon,
  // ChartBarIcon,
} from '@heroicons/react/24/outline'
import TextLogo from "../TextLogo";
import Link from "next/link";

type Role = "admin" | "organizer" | (string & {});

type NavItem = {
  name: string;
  href: string;
  icon: ComponentType<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    }
  >;
};

type RoleBasedNavigation = Record<string, ReadonlyArray<NavItem>>;

const roleBasedNavigation: RoleBasedNavigation = {
  admin: [
    {name: 'Dashboard', href: '/dashboard', icon: HomeIcon},
    {name: 'Organizers', href: '/organizers', icon: UsersIcon},
    {name: 'Finance', href: '/finance', icon: CurrencyDollarIcon},
    {name: 'Attendees', href: '/attendees', icon: UsersIcon},
    {name: 'Marketing', href: '/marketing', icon: ShoppingCartIcon},
    {name: 'Categories', href: '/categories', icon: TagIcon},
    {name: 'Staff', href: '/staff', icon: UsersIcon},
  ],
  organizer: [
    {name: 'Dashboard', href: '/dashboard', icon: HomeIcon},
    {name: 'Events', href: '/events', icon: GlobeAltIcon},
    {name: 'Coupons', href: '/coupons', icon: TicketIcon},
    {name: 'Revenue', href: '/revenue', icon: CurrencyDollarIcon},
    {name: 'Scan QR', href: '/scan-qr', icon: QrCodeIcon},
  ]
};

export default function Sidebar() {
  const [navigation, setNavigation] = useState<ReadonlyArray<NavItem>>([]);
  const [role, setRole] = useState<Role>('')

  useEffect(() => {
    const userRole: Role = 'organizer' /* getCookie('role')*/

    setRole(userRole)
    setNavigation(roleBasedNavigation[userRole] || [])
  }, []);


  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:border-gray-700 dark:bg-gray-900">
      <TextLogo className="pt-2" imgClassName="w-12"/>
      <nav className="flex flex-1 flex-col mt-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-4">
              {navigation.map((item) => {
                const absoluteHref = '/' + role + item.href;
                const isCurrent = pathname === absoluteHref;

                return (
                  <li key={item.name}>
                    <Link
                      href={absoluteHref}
                      className={classNames(
                        isCurrent ? 'bg-brand-yellow text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-brand-yellow dark:text-white dark:hover:bg-gray-700',
                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          isCurrent ? 'text-white' : 'text-gray-400 group-hover:text-brand-yellow',
                          'size-6 shrink-0',
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="/settings"
              className={classNames(
                pathname === '/settings'
                  ? 'bg-brand-yellow text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-yellow dark:text-white dark:hover:bg-gray-700',
                'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
              )}
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className={classNames(
                  pathname === '/settings' ? 'text-white' : 'text-gray-400 group-hover:text-brand-yellow',
                  'size-6 shrink-0'
                )}
              />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
