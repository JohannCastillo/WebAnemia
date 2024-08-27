import { withAuth } from "next-auth/middleware"

export default withAuth( 
 {
    pages: {
        signIn: "/",
    }
 },
);

export const config = { 
    matcher: [
        "/((?!images|_next/static|_next/image|favicon.ico|auth/login).*)",
    ] 
}