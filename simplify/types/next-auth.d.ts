import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    zone?: string | null
    avatar?: string | null
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      zone?: string | null
      avatar?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role?: string
    zone?: string | null
    avatar?: string | null
  }
}
