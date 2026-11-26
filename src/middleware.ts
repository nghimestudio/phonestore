import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout",
    "/orders",
    "/orders/:path*",
    "/cart",
    "/login",
    "/register",
  ],
};
