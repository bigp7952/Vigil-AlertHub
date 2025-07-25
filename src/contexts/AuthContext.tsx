import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Navigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  matricule: string
  nom: string
  prenom: string
  grade: string
  unite: string
  secteur: string
  role: 'admin' | 'superviseur' | 'agent' | 'operateur'
  avatar?: string
  derniere_connexion?: string
  statut: 'actif' | 'inactif' | 'suspendu'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  sessionExpiry: number | null
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  verify2FA: (code: string) => Promise<boolean>
  refreshSession: () => void
  hasPermission: (permission: string) => boolean
}

interface LoginCredentials {
  matricule: string
  motDePasse: string
  codeService?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Base de données simulée des utilisateurs autorisés
const AUTHORIZED_USERS: Record<string, {
  matricule: string
  motDePasse: string
  codeService: string
  user: User
}> = {
  'POL001': {
    matricule: 'POL001',
    motDePasse: 'SecurePass2024!',
    codeService: 'DAKAR-CENTRAL',
    user: {
      id: '1',
      matricule: 'POL001',
      nom: 'DIOP',
      prenom: 'Mamadou',
      grade: 'Commissaire',
      unite: 'Commissariat Central',
      secteur: 'Dakar-Plateau',
      role: 'admin',
      statut: 'actif'
    }
  },
  'POL002': {
    matricule: 'POL002',
    motDePasse: 'Agent@2024',
    codeService: 'DAKAR-NORD',
    user: {
      id: '2',
      matricule: 'POL002',
      nom: 'FALL',
      prenom: 'Aminata',
      grade: 'Inspecteur',
      unite: 'Brigade Mobile',
      secteur: 'Dakar-Nord',
      role: 'superviseur',
      statut: 'actif'
    }
  },
  'POL003': {
    matricule: 'POL003',
    motDePasse: 'Patrol2024#',
    codeService: 'DAKAR-SUD',
    user: {
      id: '3',
      matricule: 'POL003',
      nom: 'SARR',
      prenom: 'Ousmane',
      grade: 'Agent de Police',
      unite: 'Patrouille Urbaine',
      secteur: 'Dakar-Sud',
      role: 'agent',
      statut: 'actif'
    }
  },
  'OPE001': {
    matricule: 'OPE001',
    motDePasse: 'Control@2024',
    codeService: 'CENTRALE-OPS',
    user: {
      id: '4',
      matricule: 'OPE001',
      nom: 'BA',
      prenom: 'Fatou',
      grade: 'Opérateur',
      unite: 'Centre de Contrôle',
      secteur: 'Central',
      role: 'operateur',
      statut: 'actif'
    }
  }
}

// Permissions par rôle
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['view_all', 'edit_all', 'assign_agents', 'manage_users', 'view_reports', 'export_data', 'view_signalements', 'update_status', 'view_map', 'view_users', 'view_feedbacks', 'view_history'],
  superviseur: ['view_all', 'assign_agents', 'view_reports', 'edit_signalements', 'view_signalements', 'update_status', 'view_map', 'view_users', 'view_feedbacks', 'view_history'],
  agent: ['view_signalements', 'update_status', 'view_map', 'view_history', 'view_feedbacks', 'view_users'],
  operateur: ['view_signalements', 'receive_calls', 'dispatch_agents', 'view_map', 'view_history', 'view_feedbacks', 'view_users']
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    sessionExpiry: null
  })
  
  const { toast } = useToast()

  // Vérification de session au démarrage
  useEffect(() => {
    const checkSession = () => {
      const savedSession = localStorage.getItem('police_session')
      const sessionExpiry = localStorage.getItem('police_session_expiry')
      
      if (savedSession && sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry)
        const now = Date.now()
        
        if (now < expiryTime) {
          const user = JSON.parse(savedSession)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            sessionExpiry: expiryTime
          })
          return
        } else {
          // Session expirée
          localStorage.removeItem('police_session')
          localStorage.removeItem('police_session_expiry')
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter pour des raisons de sécurité",
            variant: "destructive"
          })
        }
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }

    checkSession()
  }, [toast])

  // Auto-logout avant expiration
  useEffect(() => {
    if (authState.sessionExpiry) {
      const timeUntilExpiry = authState.sessionExpiry - Date.now()
      
      if (timeUntilExpiry > 0) {
        // Avertissement 5 minutes avant expiration
        const warningTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000)
        
        const warningTimer = setTimeout(() => {
          toast({
            title: "Session bientôt expirée",
            description: "Votre session expirera dans 5 minutes",
            variant: "destructive"
          })
        }, warningTime)

        // Logout automatique à l'expiration
        const logoutTimer = setTimeout(() => {
          logout()
        }, timeUntilExpiry)

        return () => {
          clearTimeout(warningTimer)
          clearTimeout(logoutTimer)
        }
      }
    }
  }, [authState.sessionExpiry])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const userAuth = AUTHORIZED_USERS[credentials.matricule]
      
      if (!userAuth) {
        toast({
          title: "Matricule non reconnu",
          description: "Ce matricule n'est pas autorisé à accéder au système",
          variant: "destructive"
        })
        return false
      }
      
      if (userAuth.motDePasse !== credentials.motDePasse) {
        toast({
          title: "Mot de passe incorrect",
          description: "Vérifiez vos identifiants",
          variant: "destructive"
        })
        return false
      }
      
      if (userAuth.codeService !== credentials.codeService) {
        toast({
          title: "Code de service invalide",
          description: "Le code de service ne correspond pas à votre unité",
          variant: "destructive"
        })
        return false
      }

      if (userAuth.user.statut !== 'actif') {
        toast({
          title: "Compte suspendu",
          description: "Votre compte a été désactivé. Contactez votre supérieur.",
          variant: "destructive"
        })
        return false
      }
      
      // Session de 8 heures pour la sécurité
      const sessionExpiry = Date.now() + (8 * 60 * 60 * 1000)
      
      // Mise à jour de la dernière connexion
      const userWithConnection = {
        ...userAuth.user,
        derniere_connexion: new Date().toISOString()
      }
      
      // Sauvegarde sécurisée
      localStorage.setItem('police_session', JSON.stringify(userWithConnection))
      localStorage.setItem('police_session_expiry', sessionExpiry.toString())
      
      setAuthState({
        user: userWithConnection,
        isAuthenticated: true,
        isLoading: false,
        sessionExpiry
      })
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${userAuth.user.grade} ${userAuth.user.prenom} ${userAuth.user.nom}`,
      })
      
      return true
      
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive"
      })
      return false
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const verify2FA = async (code: string): Promise<boolean> => {
    // Simulation de vérification 2FA
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Code de test: 123456
    if (code === '123456') {
      toast({
        title: "Authentification réussie",
        description: "Code de vérification validé",
      })
      return true
    } else {
      toast({
        title: "Code incorrect",
        description: "Le code de vérification est invalide",
        variant: "destructive"
      })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('police_session')
    localStorage.removeItem('police_session_expiry')
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sessionExpiry: null
    })
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    })
  }

  const refreshSession = () => {
    if (authState.user) {
      const newExpiry = Date.now() + (8 * 60 * 60 * 1000)
      localStorage.setItem('police_session_expiry', newExpiry.toString())
      
      setAuthState(prev => ({
        ...prev,
        sessionExpiry: newExpiry
      }))
      
      toast({
        title: "Session prolongée",
        description: "Votre session a été renouvelée pour 8 heures",
      })
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false
    const userPermissions = ROLE_PERMISSIONS[authState.user.role] || []
    return userPermissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      verify2FA,
      refreshSession,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Composant de protection des routes
export function ProtectedRoute({ 
  children, 
  requiredPermission 
}: { 
  children: ReactNode
  requiredPermission?: string 
}) {
  const { isAuthenticated, isLoading, hasPermission, user } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Vérification des autorisations...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-destructive mb-2">Accès refusé</h2>
          <p className="text-sm text-muted-foreground mb-4">
                         Votre rôle <span className="font-medium">({user?.role})</span> ne dispose pas des autorisations nécessaires pour accéder à cette section.
          </p>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              Permission requise: <span className="font-mono">{requiredPermission}</span>
            </div>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/'}
              >
                Retour au Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/signalements'}
              >
                Voir les Signalements
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
} 