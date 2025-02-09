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
  const { user, isAdmin, loading } = useAuthStore()

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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.value.id)
        .single()

      if (error) throw error
      isAdmin.value = profile?.role === 'admin'
    } catch (error) {
      console.error('Error loading user role:', error)
      isAdmin.value = false
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
      isAdmin.value = false
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