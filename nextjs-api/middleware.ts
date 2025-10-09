import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

// affects all files in the API directory
export const config = {
  matcher: "/api/:path*",
};

export default function middleware(request: Request) {
  if (request.url.includes("/api/blogs")) {
    const logResult = logMiddleware(request);
    console.log(logResult.response);
  }
  const authResult = authMiddleware(request);
  // only applies to the /api/blogs endpoint
  if (!authResult?.isValid && request.url.includes("/api/blogs")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}
