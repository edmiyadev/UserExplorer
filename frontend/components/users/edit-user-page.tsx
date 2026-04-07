'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { UserPageHeader } from '@/components/users/user-page-header'
import { UserFormCard } from '@/components/users/user-form-card'
import { useUser } from '@/hooks/use-users'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty'
import { AlertCircle, RefreshCw, UserX } from 'lucide-react'

interface EditUserPageProps {
  id: number
}

export function EditUserPage({ id }: EditUserPageProps) {
  const { t } = useTranslation()
  const { data: user, isLoading, isError, error, refetch } = useUser(id)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <UserPageHeader
            title={t.common.loading}
            backHref={`/users/${id}`}
          />
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-4">
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[120px]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <UserPageHeader
            title={t.users.failedToLoad}
            backHref={`/users/${id}`}
          />
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-0">
              <Empty className="py-16 border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <AlertCircle className="text-destructive" />
                  </EmptyMedia>
                  <EmptyTitle>{t.users.failedToLoad}</EmptyTitle>
                  <EmptyDescription>
                    {error instanceof Error ? error.message : t.users.failedToLoadDescription}
                  </EmptyDescription>
                </EmptyHeader>
                <div className="flex gap-2">
                  <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t.common.retry}
                  </Button>
                  <Button asChild>
                    <Link href="/">{t.nav.backToUsers}</Link>
                  </Button>
                </div>
              </Empty>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <UserPageHeader
            title={t.users.notFound}
            backHref="/"
          />
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-0">
              <Empty className="py-16 border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UserX />
                  </EmptyMedia>
                  <EmptyTitle>{t.users.notFound}</EmptyTitle>
                  <EmptyDescription>
                    {t.users.notFoundDescription}
                  </EmptyDescription>
                </EmptyHeader>
                <Button asChild>
                  <Link href="/">{t.nav.backToUsers}</Link>
                </Button>
              </Empty>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <UserPageHeader
          title={t.userDetail.edit(user.name)}
          description={t.userDetail.editDescription}
          backHref={`/`}
        />
        <UserFormCard user={user} mode="edit" />
      </div>
    </main>
  )
}
