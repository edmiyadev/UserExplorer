'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User } from '@/lib/types/user'
import { useUsers, useDeleteUser, useCities, useCompanies } from '@/hooks/use-users'
import { UserTable } from '@/components/users/user-table'
import { SearchFilters } from '@/components/users/search-filters'
import { DeleteConfirmDialog } from '@/components/users/delete-confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty'
import { Users, Plus, UserX, AlertCircle, RefreshCw } from 'lucide-react'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useUsers({
    search: searchQuery || undefined,
    company: companyFilter && companyFilter !== 'all' ? companyFilter : undefined,
    city: cityFilter && cityFilter !== 'all' ? cityFilter : undefined,
  })
  
  const { data: cities = [] } = useCities()
  const { data: companies = [] } = useCompanies()
  const deleteUserMutation = useDeleteUser()

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    
    await deleteUserMutation.mutateAsync(userToDelete.id)
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCompanyFilter('')
    setCityFilter('')
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Users</h1>
              <p className="text-sm text-muted-foreground">
                Manage system users
              </p>
            </div>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/users/new">
              <Plus className="mr-2 h-4 w-4" />
              New User
            </Link>
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-medium">
                {isLoading
                  ? 'Loading...'
                  : `${users.length} user${users.length !== 1 ? 's' : ''}`}
              </CardTitle>
            </div>
            <SearchFilters
              searchQuery={searchQuery}
              companyFilter={companyFilter}
              cityFilter={cityFilter}
              companies={companies}
              cities={cities}
              onSearchChange={setSearchQuery}
              onCompanyChange={setCompanyFilter}
              onCityChange={setCityFilter}
              onClearFilters={handleClearFilters}
            />
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                      <Skeleton className="hidden sm:block h-4 w-[100px]" />
                      <Skeleton className="hidden md:block h-4 w-[120px]" />
                      <Skeleton className="hidden lg:block h-6 w-[80px] rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isError && !isLoading && (
              <Empty className="py-16 border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <AlertCircle className="text-destructive" />
                  </EmptyMedia>
                  <EmptyTitle>Failed to load</EmptyTitle>
                  <EmptyDescription>
                    {error instanceof Error ? error.message : 'Failed to load users'}
                  </EmptyDescription>
                </EmptyHeader>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </Empty>
            )}

            {!isLoading && !isError && users.length === 0 && (
              <Empty className="py-16 border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UserX />
                  </EmptyMedia>
                  <EmptyTitle>No users found</EmptyTitle>
                  <EmptyDescription>
                    Get started by adding your first user to the system.
                  </EmptyDescription>
                </EmptyHeader>
                <Button asChild>
                  <Link href="/users/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create first user
                  </Link>
                </Button>
              </Empty>
            )}

            {!isLoading && !isError && users.length > 0 && (
              <UserTable
                users={users}
                onDelete={handleOpenDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        user={userToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={deleteUserMutation.isPending}
      />
    </main>
  )
}
