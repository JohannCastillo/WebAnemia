import { config } from "@/lib/config";
import Cookies from "js-cookie";
import { COOKIE_ACCESS_TOKEN } from "@/constants/cookies";

const getClientSideCookie = async (name : string) => {
    if (typeof window === 'undefined') 
        return;
    console.log("getClientSideCookie", name);
    return Cookies.get(name);
}


export const fetcher = async (
    url: string,
    init?: RequestInit,
) => {
    const token = await getClientSideCookie(COOKIE_ACCESS_TOKEN);
    return fetch(`${config.backendUrl}${url}`, {
        ...init,
        headers: {
            ...init?.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
};
