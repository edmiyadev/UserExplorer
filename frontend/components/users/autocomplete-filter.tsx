'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { userApi } from '@/lib/api/users'
import { Loader2 } from 'lucide-react'

interface AutocompleteFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  filterType: 'company' | 'city'
  icon?: React.ReactNode
}

export function AutocompleteFilter({
  value,
  onChange,
  placeholder,
  filterType,
  icon,
}: AutocompleteFilterProps) {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debouncedInput = useDebounce(inputValue, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const filters = { [filterType]: debouncedInput, pageSize: 50 }
        const data = await userApi.getUsers(filters)
        
        const values = data.data
          .map((user) => (user[filterType as keyof typeof user] as string) || '')
          .filter((v) => v.toLowerCase().includes(debouncedInput.toLowerCase()))
        
        const uniqueValues = Array.from(new Set(values)).sort()
        setSuggestions(uniqueValues)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    if (showSuggestions) {
      fetchSuggestions()
    }
  }, [debouncedInput, filterType, showSuggestions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    onChange(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full sm:w-[200px]" ref={containerRef}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={icon ? 'pl-9' : ''}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover py-1 shadow-md">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
