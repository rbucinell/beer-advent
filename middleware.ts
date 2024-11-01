//without a defined matcher, this applies to all routes
export { default } from "next-auth/middleware";

export const config = { matcher: ["/admin", "/submitbeer"] };