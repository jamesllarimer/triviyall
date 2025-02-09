// middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user, isAdmin, loading } = useAuth()
    
    console.log('Admin middleware:', {
      loading: loading.value,
      user: user.value,
      isAdmin: isAdmin.value,
      appMetadata: user.value?.app_metadata,
      userRole: user.value?.app_metadata?.role
    })
    
    // Wait for auth state to load
    if (loading.value) {
      console.log('Waiting for auth to load...')
      await new Promise<void>((resolve) => {
        if (!loading.value) {
          console.log('Auth already loaded, resolving immediately')
          resolve()
        } else {
          console.log('Setting up watch for loading state')
          const unwatch = watch(loading, (newValue) => {
            console.log('Loading state changed:', newValue)
            if (!newValue) {
              unwatch()
              console.log('Auth loaded, resolving promise')
              resolve()
            }
          })
        }
      })
      console.log('Auth load wait completed')
    }
    
    console.log('Final auth state:', {
      user: user.value,
      isAdmin: isAdmin.value
    })
    
    // Redirect to login if not authenticated
    if (!user.value) {
      console.log('No user, redirecting to login')
      return navigateTo('/auth/login')
    }
    
    // Redirect to home if not admin
    if (!isAdmin.value) {
      console.log('User is not admin, redirecting to home')
      return navigateTo('/')
    }
    
    console.log('Admin check passed')
})
