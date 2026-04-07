import type { Metadata } from 'next'
import { EditUserPage } from '@/components/users/edit-user-page'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Edit User #${id} | User Explorer`,
    description: `Edit details for user #${id}`,
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <EditUserPage id={Number(id)} />
}
