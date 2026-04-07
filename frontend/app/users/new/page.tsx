'use client'

import { UserPageHeader } from '@/components/users/user-page-header'
import { UserFormCard } from '@/components/users/user-form-card'
import { useTranslation } from '@/lib/i18n'

export default function NewUserPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <UserPageHeader
          title={t.pages.createUser}
          description={t.pages.createUserDescription}
        />
        <UserFormCard mode="create" />
      </div>
    </main>
  )
}
