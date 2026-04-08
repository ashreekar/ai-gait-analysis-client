import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/live/:path*", "/health/:path*", "/history/:path*", "/settings/:path*"],
};