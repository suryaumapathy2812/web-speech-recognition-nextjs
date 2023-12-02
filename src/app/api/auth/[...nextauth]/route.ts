import NextAuth, { NextAuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/navigation";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      name: string;
      email: string;
      id: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
  }
}


/** @type {*} */
const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      console.log("signIn");
      return true
    },
    async session({ session, token, user }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;

      console.log("session", session);
      console.log("token", token);
      console.log("user", user);

      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };