export const es = {
  // Common
  common: {
    loading: 'Cargando...',
    cancel: 'Cancelar',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    create: 'Crear',
    back: 'Volver',
    retry: 'Reintentar',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpiar',
    notSpecified: 'No especificado',
    saveChanges: 'Guardar cambios',
  },

  // Navigation
  nav: {
    backToUsers: 'Volver a usuarios',
  },

  // Users
  users: {
    title: 'Usuarios',
    description: 'Administrar usuarios del sistema',
    newUser: 'Nuevo Usuario',
    createFirstUser: 'Crear primer usuario',
    userCount: (count: number) => `${count} usuario${count !== 1 ? 's' : ''}`,
    notFound: 'Usuario no encontrado',
    notFoundDescription: 'El usuario que buscas no existe o ha sido eliminado.',
    noUsersFound: 'No se encontraron usuarios',
    noUsersFoundDescription: 'Comienza agregando tu primer usuario al sistema.',
    failedToLoad: 'Error al cargar',
    failedToLoadDescription: 'No se pudieron cargar los usuarios',
    viewDetails: 'Ver detalles',
  },

  // User Form
  userForm: {
    createTitle: 'Información del Usuario',
    createDescription: 'Completa los detalles a continuación para crear una nueva cuenta de usuario.',
    editTitle: 'Editar Información',
    editDescription: 'Actualiza la información del usuario a continuación.',
    name: 'Nombre',
    namePlaceholder: 'Nombre completo',
    email: 'Correo electrónico',
    emailPlaceholder: 'correo@ejemplo.com',
    phone: 'Teléfono',
    phonePlaceholder: '+1 555 000 0000',
    company: 'Empresa',
    companyPlaceholder: 'Nombre de la empresa',
    city: 'Ciudad',
    cityPlaceholder: 'Ciudad',
    createUser: 'Crear usuario',
    updateUser: 'Actualizar usuario',
  },

  // User Detail
  userDetail: {
    title: 'Detalles del Usuario',
    description: (name: string) => `Viendo perfil de ${name}`,
    edit: (name: string) => `Editar ${name}`,
    editDescription: 'Actualizar información del usuario',
    id: 'ID',
  },

  // Search and Filters
  filters: {
    searchPlaceholder: 'Buscar por nombre o correo...',
    filterByCompany: 'Filtrar por empresa',
    filterByCity: 'Filtrar por ciudad',
    allCompanies: 'Todas las empresas',
    allCities: 'Todas las ciudades',
    clearFilters: 'Limpiar filtros',
  },

  // Pagination
  pagination: {
    rowsPerPage: 'Filas por página:',
    of: 'de',
    results: 'resultados',
    firstPage: 'Primera página',
    previousPage: 'Página anterior',
    nextPage: 'Página siguiente',
    lastPage: 'Última página',
    page: 'Página',
  },

  // Table
  table: {
    user: 'Usuario',
    phone: 'Teléfono',
    company: 'Empresa',
    city: 'Ciudad',
    actions: 'Acciones',
    openMenu: 'Abrir menú',
  },

  // Delete Dialog
  deleteDialog: {
    title: 'Eliminar Usuario',
    description: (name: string) => 
      `¿Estás seguro de que deseas eliminar a ${name}? Esta acción no se puede deshacer.`,
    deleting: 'Eliminando...',
  },

  // Toast Messages
  toast: {
    userCreated: 'Usuario creado exitosamente',
    userUpdated: 'Usuario actualizado exitosamente',
    userDeleted: 'Usuario eliminado exitosamente',
    createError: 'Error al crear usuario',
    updateError: 'Error al actualizar usuario',
    deleteError: 'Error al eliminar usuario',
  },

  // Validation
  validation: {
    nameRequired: 'El nombre es requerido',
    emailRequired: 'El correo electrónico es requerido',
    emailInvalid: 'Formato de correo electrónico inválido',
  },

  // Empty States
  empty: {
    noResults: 'No hay resultados',
    tryAgain: 'Intenta de nuevo',
  },

  // Pages
  pages: {
    createUser: 'Crear Nuevo Usuario',
    createUserDescription: 'Agregar un nuevo usuario al sistema',
  },
} as const

export type TranslationKeys = typeof es
