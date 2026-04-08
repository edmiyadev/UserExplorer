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

type UserFormValues = z.infer<ReturnType<typeof createUserFormSchema>>

function createUserFormSchema(t: { validation: Record<string, string | ((n: number) => string)> }) {
  return z.object({
    name: z
      .string()
      .min(1, t.validation.nameRequired as string)
      .max(100, (t.validation.nameMaxLength as (n: number) => string)(100)),
    email: z
      .email(t.validation.emailInvalid as string)
      .max(150, (t.validation.emailMaxLength as (n: number) => string)(150)),
    phone: z
      .string()
      .max(20, (t.validation.phoneMaxLength as (n: number) => string)(20))
      .optional()
      .or(z.literal('')),
    company: z
      .string()
      .max(100, (t.validation.companyMaxLength as (n: number) => string)(100))
      .optional()
      .or(z.literal('')),
    city: z
      .string()
      .max(100, (t.validation.cityMaxLength as (n: number) => string)(100))
      .optional()
      .or(z.literal('')),
  })
}

interface UserFormProps {
  user?: User | null
  onSubmit: (data: CreateUserDto) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  serverError?: string | null
}

export function UserForm({ user, onSubmit, onCancel, isSubmitting = false, serverError }: UserFormProps) {
  const { t } = useTranslation()

  const userFormSchema = createUserFormSchema(t)

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

  // Show server-side email error (e.g. duplicate) on the email field
  useEffect(() => {
    if (serverError) {
      form.setError('email', { type: 'server', message: serverError })
    }
  }, [serverError, form])

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
                <Input placeholder={t.userForm.namePlaceholder} maxLength={100} {...field} />
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
                <Input type="email" placeholder={t.userForm.emailPlaceholder} maxLength={150} {...field} />
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
                <Input placeholder={t.userForm.phonePlaceholder} maxLength={20} {...field} />
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
                <Input placeholder={t.userForm.companyPlaceholder} maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.userForm.city}</FormLabel>
              <FormControl>
                <Input placeholder={t.userForm.cityPlaceholder} maxLength={100} {...field} />
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
