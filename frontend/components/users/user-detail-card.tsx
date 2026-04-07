'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DeleteConfirmDialog } from '@/components/users/delete-confirm-dialog'
import { useDeleteUser } from '@/hooks/use-users'
import { Mail, Phone, Building2, MapPin, Pencil, Trash2 } from 'lucide-react'
import type { User } from '@/lib/types/user'

interface UserDetailCardProps {
  user: User
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const deleteMutation = useDeleteUser()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(user.id)
    setDeleteDialogOpen(false)
    router.push('/')
  }

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription className="mt-1">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {t.userDetail.id}: {user.id}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/users/${user.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t.common.edit}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.common.delete}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{t.userForm.email}</span>
              </div>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{t.userForm.phone}</span>
              </div>
              <p className="font-medium">{user.phone || t.common.notSpecified}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{t.userForm.company}</span>
              </div>
              <p className="font-medium">{user.company || t.common.notSpecified}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t.userForm.city}</span>
              </div>
              <p className="font-medium">{user.city || t.common.notSpecified}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        user={user}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
