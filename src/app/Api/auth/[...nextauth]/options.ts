import NextAuthOtions, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/Model/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "Credentials",
      credentials: {
        username: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any):Promise<any>{
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No  account found");
          }
          if (!user.isVarified) {
            throw new Error("please varify your account");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;

          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],


  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVarified = user.isVarified?.toString();
        token.isAcceptingMessages= user.isAcceptingMessages,
        token.username= user.username

      }
      return token;
    },
    async session({ session, token }) {
      if(token){
        session.user._id= token._id,
        session.user.isVarified= token.isVarified,
        session.user.isAcceptingMessages= token.isAcceptingMessages,
        session.user.username= token.username

      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECTRET_KEY,

 
};
