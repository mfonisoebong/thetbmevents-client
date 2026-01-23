import { getCookie } from "@lib/utils";
import { useEffect, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const rawUser = getCookie('user');

        let parsedUser: any = null;
        if (rawUser) {
            try {
                parsedUser = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
            } catch {
                parsedUser = null;
            }
        }
        setUser(parsedUser);

        const cookieRole = getCookie('role');
        setRole(cookieRole);

        const derivedName = cookieRole === 'admin' ? 'Administrator' : parsedUser?.business_name ?? null;
        setName(derivedName);
    }, []);

    return { user, role, name };
}
