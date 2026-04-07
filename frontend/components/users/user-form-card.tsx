'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserForm } from '@/components/users/user-form'
import { useCreateUser, useUpdateUser } from '@/hooks/use-users'
import type { User, CreateUserDto } from '@/lib/types/user'

interface UserFormCardProps {
  user?: User
  mode: 'create' | 'edit'
}

export function UserFormCard({ user, mode }: UserFormCardProps) {
  const router = useRouter()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (data: CreateUserDto) => {
    if (mode === 'edit' && user) {
      await updateMutation.mutateAsync({ id: user.id, data })
      router.push(`/users/${user.id}`)
    } else {
      const newUser = await createMutation.mutateAsync(data)
      router.push(`/users/${newUser.id}`)
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
        <CardTitle>{mode === 'create' ? 'User Information' : 'Edit Information'}</CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Fill in the details below to create a new user account.'
            : 'Update the user information below.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  )
}
