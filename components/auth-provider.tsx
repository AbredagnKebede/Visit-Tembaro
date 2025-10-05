'use client'

import { SessionProvider, useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export function useAuth() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const user = session?.user ?? null
  const signIn = async (email: string, password: string) => {
    const res = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (res?.error) throw new Error(res.error)
  }
  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/admin' })
  }
  return { user, loading, signIn, signOut }
}
