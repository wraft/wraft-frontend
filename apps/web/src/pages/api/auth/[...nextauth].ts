import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { envConfig } from 'utils/env';

export const API_HOST = envConfig.API_HOST;

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID
        ? process.env.GOOGLE_CLIENT_ID
        : '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
        ? process.env.GOOGLE_CLIENT_SECRET
        : '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        const { id_token } = account;
        try {
          const response = await axios.post(
            `${API_HOST}/api/v1/users/signin/google`,
            {
              token: id_token,
            },
          );
          user.data = response.data;
          return true;
        } catch (error) {
          throw new Error('Somthing wrong');
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: token?.user || {},
      };
    },
    async jwt({ user, token }: any) {
      if (user?.data) {
        token.user = user.data;
      }
      return token;
    },
  },
  pages: {
    error: '/login',
  },
});
