import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { AppRouter } from "./contants/AppRoutes";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  try {
    const { supabaseResponse, user } = await updateSession(req);

    if (
      user &&
      (pathname === AppRouter.Login || pathname === AppRouter.Signup)
    ) {
      return NextResponse.redirect(new URL(AppRouter.CreateTodo, req.url));
    }

    if (!user && pathname === AppRouter.CreateTodo) {
      return NextResponse.redirect(new URL(AppRouter.Login, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL(AppRouter.Login, req.url));
  }
}

export const config = {
  matcher: ["/create-todo", "/login", "/signup"],
};
