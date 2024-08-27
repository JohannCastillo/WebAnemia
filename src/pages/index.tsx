import Login from "@/login/Login";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function HomePage() {
  const session = useSession();
  const router = useRouter();
  useEffect(()=>{
    if(session.status === "authenticated"){
      router.push("/guest/register");
    }
  }, [session.status])

  return (
    session.status === "unauthenticated" && (
        <Login/>
    )
  );
}
