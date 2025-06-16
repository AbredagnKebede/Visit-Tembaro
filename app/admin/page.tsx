"use client"
import { useAuth } from "@/components/auth-provider"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return <div className="min-h-screen bg-gray-50">{user ? <AdminDashboard /> : <AdminLogin />}</div>
}
