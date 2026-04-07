'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types/user'
import { useTranslation } from '@/lib/i18n'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'

interface UserTableProps {
  users: User[]
  onDelete: (user: User) => void
}

export function UserTable({ users, onDelete }: UserTableProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border">
          <TableHead className="w-[300px]">{t.table.user}</TableHead>
          <TableHead className="hidden md:table-cell">{t.table.phone}</TableHead>
          <TableHead className="hidden lg:table-cell">{t.table.company}</TableHead>
          <TableHead className="hidden sm:table-cell">{t.table.city}</TableHead>
          <TableHead className="w-[60px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="cursor-pointer border-border"
            onClick={() => router.push(`/users/${user.id}`)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {user.phone}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Badge variant="outline" className="font-normal">
                {user.company}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell text-muted-foreground">
              {user.city}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{t.table.openMenu}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
                    <Link href={`/users/${user.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t.users.viewDetails}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
                    <Link href={`/users/${user.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      {t.common.edit}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(user)
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t.common.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
