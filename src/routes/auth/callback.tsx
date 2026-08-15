import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate({ to: '/' })
      }
    })

    // Fallback if no event fires within a reasonable time
    const timeout = setTimeout(() => {
      navigate({ to: '/' })
    }, 5000)

    return () => clearTimeout(timeout)
  }, [navigate])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-black chrome-text uppercase italic tracking-tighter">
          AUTENTICANDO...
        </h2>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
          SINCRONIZANDO COM O NÚCLEO CIPHER
        </p>
      </div>
    </div>
  )
}
