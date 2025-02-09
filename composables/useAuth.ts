// composables/useAuth.ts
import { User } from '@supabase/supabase-js'

export const useAuthStore = () => {
  const user = useState<User | null>('user', () => null)
  const isAdmin = useState<boolean>('isAdmin', () => false)
  const loading = useState<boolean>('loading', () => true)

  return {
    user,
    isAdmin,
    loading
  }
}

export const useAuth = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { user, loading } = useAuthStore()

  const isAdmin = computed(() => {
    if (!user.value) return false
    
    // Check both places where admin role might be stored
    const hasAdminMetadata = user.value.app_metadata?.role === 'admin'
    const hasAdminUserMetadata = user.value.user_metadata?.role === 'admin'
    
    console.log('Admin check:', {
      user: user.value,
      app_metadata: user.value.app_metadata,
      user_metadata: user.value.user_metadata,
      hasAdminMetadata,
      hasAdminUserMetadata
    })
    
    return hasAdminMetadata || hasAdminUserMetadata
  })

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user ?? null

      if (user.value) {
        await loadUserRole()
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user)
        user.value = session?.user ?? null
        
        if (user.value) {
          await loadUserRole()
        } else {
          isAdmin.value = false
        }
      })
    } finally {
      loading.value = false
    }
  }

  const loadUserRole = async () => {
    if (!user.value) return

    try {
      // First check if user already has admin role in their metadata
      if (isAdmin.value) return

      // If not, check the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.value.id)
        .single()

      if (error) throw error
      
      // If user is admin in profiles, update their metadata
      if (profile?.role === 'admin') {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { role: 'admin' }
        })
        
        if (updateError) throw updateError
        
        // Refresh the session to get updated metadata
        const { data: { session } } = await supabase.auth.getSession()
        user.value = session?.user ?? null
      }
    } catch (error) {
      console.error('Error loading user role:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      
      user.value = data.user
      await loadUserRole()
      await router.push('/')
      
      return { error: null, user: data.user }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      user.value = null
      await router.push('/auth/login')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
    initAuth
  }
}