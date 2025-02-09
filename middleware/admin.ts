// middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user, isAdmin, loading } = useAuth()
    
    // Wait for auth state to load
    if (loading.value) {
      await until(loading).toBe(false)
    }
    
    // Redirect to login if not authenticated
    if (!user.value) {
      return navigateTo('/auth/login')
    }
    
    // Redirect to home if not admin
    if (!isAdmin.value) {
      return navigateTo('/')
    }
  })
  