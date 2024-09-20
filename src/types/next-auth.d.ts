import "next-auth";
import { isValid } from "zod";
declare module "next-auth" {
  interface User {
    _id?: string;
    isVarified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
         _id?: string;
         isVarified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    } & DefaultSession["user"]
  }
}
// declare module "next-auth/jwt" {
//   interface JWT {
//     _id?: string;
//     isVarified?: boolean;
//     isAcceptingMessages?: boolean;
//     username?: string;
//   }
// }
