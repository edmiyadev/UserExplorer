'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserForm } from '@/components/users/user-form'
import { useCreateUser, useUpdateUser } from '@/hooks/use-users'
import { ApiError } from '@/lib/api/api-client'
import type { User, CreateUserDto } from '@/lib/types/user'

interface UserFormCardProps {
  user?: User
  mode: 'create' | 'edit'
}

export function UserFormCard({ user, mode }: UserFormCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const [serverError, setServerError] = useState<string | null>(null)

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (data: CreateUserDto) => {
    setServerError(null)

    try {
      if (mode === 'edit' && user) {
        await updateMutation.mutateAsync({ id: user.id, data })
        router.push(`/users/${user.id}`)
      } else {
        const newUser = await createMutation.mutateAsync(data)
        router.push(`/users/${newUser.id}`)
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setServerError(t.validation.emailDuplicate)
      }
    }
  }

  const handleCancel = () => {
    if (mode === 'edit' && user) {
      router.push(`/users/${user.id}`)
    } else {
      router.push('/')
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? t.userForm.createTitle : t.userForm.editTitle}</CardTitle>
        <CardDescription>
          {mode === 'create'
            ? t.userForm.createDescription
            : t.userForm.editDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          serverError={serverError}
        />
      </CardContent>
    </Card>
  )
}
