import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminHash = process.env.ADMIN_PASSWORD_HASH

        console.log('DEBUG [Auth]: Attempting login for:', credentials.email)
        console.log('DEBUG [Auth]: Admin Email Configured:', !!adminEmail)
        console.log('DEBUG [Auth]: Admin Hash Configured:', !!adminHash)

        if (!adminEmail || !adminHash) {
          console.error('DEBUG [Auth]: Admin credentials not configured in environment variables')
          return null
        }

        if (credentials.email !== adminEmail) {
          console.log('DEBUG [Auth]: Email mismatch')
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, adminHash)
        console.log('DEBUG [Auth]: Password valid:', isValid)
        
        if (!isValid) return null

        return { id: '1', email: adminEmail, name: 'Admin' }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.name = 'Admin'
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
