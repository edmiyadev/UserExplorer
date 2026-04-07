"use client"

import { useLanguage } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      className="rounded-full flex items-center justify-center"
      title={locale === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
    >
      <span className="text-[0.65rem] font-bold leading-none">
        {locale.toUpperCase()}
      </span>
    </Button>
  )
}
