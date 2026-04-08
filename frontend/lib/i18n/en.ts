export const en = {
  // Common
  common: {
    loading: 'Loading...',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    back: 'Back',
    retry: 'Retry',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    notSpecified: 'Not specified',
    saveChanges: 'Save changes',
  },

  // Navigation
  nav: {
    backToUsers: 'Back to users',
  },

  // Users
  users: {
    title: 'Users',
    description: 'Manage system users',
    newUser: 'New User',
    createFirstUser: 'Create first user',
    userCount: (count: number) => `${count} user${count !== 1 ? 's' : ''}`,
    notFound: 'User not found',
    notFoundDescription: 'The user you are looking for does not exist or has been deleted.',
    noUsersFound: 'No users found',
    noUsersFoundDescription: 'Get started by adding your first user to the system.',
    failedToLoad: 'Failed to load',
    failedToLoadDescription: 'Could not load users',
    viewDetails: 'View details',
  },

  // User Form
  userForm: {
    createTitle: 'User Information',
    createDescription: 'Fill out the details below to create a new user account.',
    editTitle: 'Edit Information',
    editDescription: 'Update user information below.',
    name: 'Name',
    namePlaceholder: 'Full name',
    email: 'Email',
    emailPlaceholder: 'email@example.com',
    phone: 'Phone',
    phonePlaceholder: '809 000 0000',
    company: 'Company',
    companyPlaceholder: 'Company name',
    city: 'City',
    cityPlaceholder: 'City',
    createUser: 'Create user',
    updateUser: 'Update user',
  },

  // User Detail
  userDetail: {
    title: 'User Details',
    description: (name: string) => `Viewing profile of ${name}`,
    edit: (name: string) => `Edit ${name}`,
    editDescription: 'Update user information',
    id: 'ID',
  },

  // Search and Filters
  filters: {
    searchPlaceholder: 'Search by name or email...',
    filterByCompany: 'Filter by company',
    filterByCity: 'Filter by city',
    allCompanies: 'All companies',
    allCities: 'All cities',
    clearFilters: 'Clear filters',
  },

  // Pagination
  pagination: {
    rowsPerPage: 'Rows per page:',
    of: 'of',
    results: 'results',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    page: 'Page',
  },

  // Table
  table: {
    user: 'User',
    phone: 'Phone',
    company: 'Company',
    city: 'City',
    actions: 'Actions',
    openMenu: 'Open menu',
  },

  // Delete Dialog
  deleteDialog: {
    title: 'Delete User',
    description: (name: string) => 
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
    deleting: 'Deleting...',
  },

  // Toast Messages
  toast: {
    userCreated: 'User created successfully',
    userUpdated: 'User updated successfully',
    userDeleted: 'User deleted successfully',
    createError: 'Error creating user',
    updateError: 'Error updating user',
    deleteError: 'Error deleting user',
  },

  // Validation
  validation: {
    nameRequired: 'Name is required',
    nameMaxLength: (n: number) => `Name must not exceed ${n} characters`,
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email format',
    emailMaxLength: (n: number) => `Email must not exceed ${n} characters`,
    emailDuplicate: 'This email is already registered',
    phoneMaxLength: (n: number) => `Phone must not exceed ${n} characters`,
    companyMaxLength: (n: number) => `Company must not exceed ${n} characters`,
    cityMaxLength: (n: number) => `City must not exceed ${n} characters`,
  },

  // Empty States
  empty: {
    noResults: 'No results',
    tryAgain: 'Try again',
  },

  // Pages
  pages: {
    createUser: 'Create New User',
    createUserDescription: 'Add a new user to the system',
  },
} as const

export type TranslationKeys = typeof en
