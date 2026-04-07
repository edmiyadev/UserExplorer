'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { User, CreateUserDto } from '@/lib/types/user'

const userFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  user?: User | null
  onSubmit: (data: CreateUserDto) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isSubmitting = false }: UserFormProps) {
  const { t } = useTranslation()
  
  const userFormSchema = z.object({
    name: z.string().min(1, t.validation.nameRequired),
    email: z.email(t.validation.emailInvalid),
    phone: z.string().optional(),
    company: z.string().optional(),
    city: z.string().optional(),
  })
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      city: '',
    },
  })


  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        company: user.company || '',
        city: user.city || '',
      })
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        city: '',
      })
    }
  }, [user, form])

  const handleSubmit = async (values: UserFormValues) => {
    await onSubmit(values)
  }

  const isEditMode = !!user

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.userForm.name}</FormLabel>
              <FormControl>
                <Input placeholder={t.userForm.namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.userForm.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t.userForm.emailPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.userForm.phone}</FormLabel>
              <FormControl>
                <Input placeholder={t.userForm.phonePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.userForm.company}</FormLabel>
              <FormControl>
                <Input placeholder={t.userForm.companyPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field}) => (
            <FormItem>
              <FormLabel>{t.userForm.city}</FormLabel>
              <FormControl>
                <Input placeholder={t.userForm.cityPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="mr-2" />}
            {isEditMode ? t.common.saveChanges : t.userForm.createUser}
          </Button>
        </div>
      </form>
    </Form>
  )
}
