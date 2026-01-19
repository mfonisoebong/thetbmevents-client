"use client"

import {useEffect, useState} from "react";
import {classNames} from "@lib/utils";
import {usePathname} from "next/navigation";
import HTTP from "../../lib/HTTP";

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
} from '@heroicons/react/24/outline'
import TextLogo from "../TextLogo";
import Link from "next/link";

const roleBasedNavigation = {
  admin: [
    {name: 'Dashboard', href: '/dashboard', icon: HomeIcon},
    {name: 'Organizers', href: '#', icon: UsersIcon},
    {name: 'Finance', href: '#', icon: CurrencyDollarIcon},
    {name: 'Attendees', href: '#', icon: UsersIcon},
    {name: 'Marketing', href: '#', icon: ShoppingCartIcon},
    {name: 'Categories', href: '#', icon: TagIcon},
    {name: 'Staff', href: '#', icon: UsersIcon},
  ],
  organizer: [
    {name: 'Dashboard', href: '/dashboard', icon: HomeIcon},
    {name: 'Events', href: '/events', icon: GlobeAltIcon},
    {name: 'Coupons', href: '/coupons', icon: TicketIcon},
    {name: 'Marketing', href: '/marketing', icon: ShoppingCartIcon},
    {name: 'Scan QR', href: '/scan-qr', icon: QrCodeIcon},
  ]
};

export default function Sidebar() {
  const [navigation, setNavigation] = useState([]);
  const [role, setRole] = useState('')

  useEffect(() => {
    const role = 'organizer' /* getCookie('role')*/

    setRole(role)
    setNavigation(roleBasedNavigation[role] || [])
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
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-brand-yellow dark:text-white dark:hover:bg-gray-700"
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className="size-6 shrink-0 text-gray-400 group-hover:text-brand-yellow"
              />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
