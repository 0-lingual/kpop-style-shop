import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.id === process.env.ADMIN_ID &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Admin" }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
