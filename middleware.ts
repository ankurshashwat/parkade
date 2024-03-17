import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/api/webhook'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/api/webhook'],
});
 
export const config = {
  // Protects all routes, including api/trpc.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};