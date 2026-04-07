import type { Metadata } from 'next'
import { UserDetailPage } from '@/components/users/user-detail-page'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `User #${id} | User Explorer`,
    description: `View details for user #${id}`,
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <UserDetailPage id={Number(id)} />
}
