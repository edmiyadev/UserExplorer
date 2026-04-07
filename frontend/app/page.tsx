'use client'

import { useState } from 'react'
import { User, CreateUserDto } from '@/lib/types/user'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useCities, useCompanies } from '@/hooks/use-users'
import { UserTable } from '@/components/users/user-table'
import { UserForm } from '@/components/users/user-form'
import { UserDetail } from '@/components/users/user-detail'
import { SearchFilters } from '@/components/users/search-filters'
import { DeleteConfirmDialog } from '@/components/users/delete-confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty'
import { Users, Plus, UserX, AlertCircle, RefreshCw } from 'lucide-react'

type ModalMode = 'create' | 'edit' | 'view' | null

export default function UsersPage() {

  const [searchQuery, setSearchQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
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
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const handleOpenCreate = () => {
    setSelectedUser(null)
    setModalMode('create')
  }

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setModalMode('edit')
  }

  const handleOpenView = (user: User) => {
    setSelectedUser(user)
    setModalMode('view')
  }

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleCloseModal = () => {
    setModalMode(null)
    setSelectedUser(null)
  }

  const handleSubmit = async (data: CreateUserDto) => {
    if (modalMode === 'edit' && selectedUser) {
      await updateUserMutation.mutateAsync({ id: selectedUser.id, data })
    } else {
      await createUserMutation.mutateAsync(data)
    }
    handleCloseModal()
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    
    await deleteUserMutation.mutateAsync(userToDelete.id)
    setDeleteDialogOpen(false)
    setUserToDelete(null)
    
    if (selectedUser?.id === userToDelete.id) {
      handleCloseModal()
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCompanyFilter('')
    setCityFilter('')
  }

  const handleRetry = () => {
    refetch()
  }

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
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
          <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New User
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
                <Button onClick={handleRetry} variant="outline">
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
                <Button onClick={handleOpenCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create first user
                </Button>
              </Empty>
            )}

            {!isLoading && !isError && users.length > 0 && (
              <UserTable
                users={users}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={modalMode === 'create' || modalMode === 'edit'}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'New User' : 'Edit User'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'create'
                ? 'Fill out the form to add a new user.'
                : 'Update the user information.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={modalMode === 'edit' ? selectedUser : null}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Sheet
        open={modalMode === 'view'}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>
              Complete information for the selected user.
            </SheetDescription>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6">
              <UserDetail
                user={selectedUser}
                onEdit={() => setModalMode('edit')}
                onDelete={() => handleOpenDelete(selectedUser)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

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
