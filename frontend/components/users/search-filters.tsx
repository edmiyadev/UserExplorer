'use client'

import { useTranslation } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Building2, MapPin } from 'lucide-react'
import { AutocompleteFilter } from './autocomplete-filter'

interface SearchFiltersProps {
  searchQuery: string
  companyFilter: string
  cityFilter: string
  onSearchChange: (value: string) => void
  onCompanyChange: (value: string) => void
  onCityChange: (value: string) => void
  onClearFilters: () => void
}

export function SearchFilters({
  searchQuery,
  companyFilter,
  cityFilter,
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
      <div className="flex flex-col gap-2 sm:flex-row">
        <AutocompleteFilter
          value={companyFilter}
          onChange={onCompanyChange}
          placeholder={t.filters.filterByCompany}
          filterType="company"
          icon={<Building2 className="h-4 w-4" />}
        />
        <AutocompleteFilter
          value={cityFilter}
          onChange={onCityChange}
          placeholder={t.filters.filterByCity}
          filterType="city"
          icon={<MapPin className="h-4 w-4" />}
        />
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
