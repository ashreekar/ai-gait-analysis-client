import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/db/connect.db";
import { User } from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Gait Suite",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // 1. Check if user exists
        let user = await User.findOne({ email: credentials.email }).select("+password");

        if (user) {
          // 2. Existing User: Validate Password
          const isValid = await user.isPasswordCorrect(credentials.password);
          if (!isValid) throw new Error("Incorrect password for this account.");
        } else {
          // 3. New User: Create Account
          user = await User.create({
            email: credentials.email,
            password: credentials.password, // Schema pre-save hook will hash this
            name: credentials.email.split('@')[0], // Default name from email
          });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};