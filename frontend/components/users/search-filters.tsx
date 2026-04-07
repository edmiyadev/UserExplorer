'use client'

import { useTranslation } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface SearchFiltersProps {
  searchQuery: string
  companyFilter: string
  cityFilter: string
  companies: string[]
  cities: string[]
  onSearchChange: (value: string) => void
  onCompanyChange: (value: string) => void
  onCityChange: (value: string) => void
  onClearFilters: () => void
}

export function SearchFilters({
  searchQuery,
  companyFilter,
  cityFilter,
  companies,
  cities,
  onSearchChange,
  onCompanyChange,
  onCityChange,
  onClearFilters,
}: SearchFiltersProps) {
  const { t } = useTranslation()
  const hasFilters = searchQuery || companyFilter || cityFilter

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.filters.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Select value={companyFilter} onValueChange={onCompanyChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t.filters.filterByCompany} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.filters.allCompanies}</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={cityFilter} onValueChange={onCityChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t.filters.filterByCity} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.filters.allCities}</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFilters}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t.filters.clearFilters}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
