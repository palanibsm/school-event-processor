import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isSignInPage = req.nextUrl.pathname.startsWith("/signin");
  const isAuthApi = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow auth routes and sign-in page
  if (isAuthApi || isSignInPage) {
    return NextResponse.next();
  }

  // Block unauthenticated API access
  if (req.nextUrl.pathname.startsWith("/api/") && !req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect unauthenticated users to sign-in
  if (!req.auth) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|pdf.worker.min.mjs).*)"],
};
