import {getCookie} from "@lib/utils";
import {useEffect, useState} from "react";

export default function useUser() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const user =  JSON.parse(getCookie('user'));
        setUser(user);

        const role = getCookie('role');
        setRole(role);

        const name = role === 'admin' ? 'Administrator' : user?.business_name;
        setName(name);
    }, []);

    return { user, role, name };
}
