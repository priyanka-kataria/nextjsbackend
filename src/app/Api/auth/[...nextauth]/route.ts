import nextAuth, { AuthOptions } from "next-auth";
import { authOptions } from "./options";

const handle= nextAuth(authOptions);
export {handle as GET, handle as POST}