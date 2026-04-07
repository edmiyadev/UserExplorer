import type { Metadata } from 'next'
import { UserPageHeader } from '@/components/users/user-page-header'
import { UserFormCard } from '@/components/users/user-form-card'

export const metadata: Metadata = {
  title: 'Create User | User Explorer',
  description: 'Create a new user in the system',
}

export default function NewUserPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <UserPageHeader
          title="Create New User"
          description="Add a new user to the system"
        />
        <UserFormCard mode="create" />
      </div>
    </main>
  )
}
