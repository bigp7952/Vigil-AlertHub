import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Building2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  KeyRound
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LoginStep {
  id: 'credentials' | '2fa' | 'success'
  title: string
  description: string
}

const LOGIN_STEPS: LoginStep[] = [
  {
    id: 'credentials',
    title: 'Authentification',
    description: 'Identifiants officiels requis'
  },
  {
    id: '2fa',
    title: 'Vérification',
    description: 'Code de sécurité à 6 chiffres'
  },
  {
    id: 'success',
    title: 'Accès autorisé',
    description: 'Redirection en cours...'
  }
]

// Comptes de démonstration
const DEMO_ACCOUNTS = [
  {
    matricule: 'POL001',
    nom: 'Commissaire DIOP',
    grade: 'Commissaire',
    unite: 'Central',
    role: 'admin'
  },
  {
    matricule: 'POL002',
    nom: 'Inspecteur FALL',
    grade: 'Inspecteur',
    unite: 'Brigade Mobile',
    role: 'superviseur'
  },
  {
    matricule: 'POL003',
    nom: 'Agent SARR',
    grade: 'Agent',
    unite: 'Patrouille',
    role: 'agent'
  },
  {
    matricule: 'OPE001',
    nom: 'Opérateur BA',
    grade: 'Opérateur',
    unite: 'Central Ops',
    role: 'operateur'
  }
]

export default function Login() {
  const { login, verify2FA, isLoading } = useAuth()
  const navigate = useNavigate()
  
  const [currentStep, setCurrentStep] = useState<'credentials' | '2fa' | 'success'>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [show2FAHelp, setShow2FAHelp] = useState(false)
  
  // Formulaire d'authentification
  const [credentials, setCredentials] = useState({
    matricule: '',
    motDePasse: '',
    codeService: ''
  })
  
  // Code 2FA
  const [code2FA, setCode2FA] = useState('')
  const [attempts2FA, setAttempts2FA] = useState(0)
  
  // Validation des champs
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateCredentials = () => {
    const newErrors: Record<string, string> = {}
    
    if (!credentials.matricule.match(/^[A-Z]{3}[0-9]{3}$/)) {
      newErrors.matricule = 'Format: 3 lettres + 3 chiffres (ex: POL001)'
    }
    
    if (credentials.motDePasse.length < 8) {
      newErrors.motDePasse = 'Minimum 8 caractères requis'
    }
    
    if (!credentials.codeService.match(/^[A-Z-]+$/)) {
      newErrors.codeService = 'Code de service invalide'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateCredentials()) return
    
    const success = await login(credentials)
    if (success) {
      setCurrentStep('2fa')
    }
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code2FA.length !== 6) {
      setErrors({ code2FA: 'Le code doit contenir exactement 6 chiffres' })
      return
    }
    
    const success = await verify2FA(code2FA)
    if (success) {
      setCurrentStep('success')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } else {
      setAttempts2FA(prev => prev + 1)
      if (attempts2FA >= 2) {
        setCurrentStep('credentials')
        setCredentials({ matricule: '', motDePasse: '', codeService: '' })
        setCode2FA('')
        setAttempts2FA(0)
      }
    }
  }

  const fillDemoCredentials = (account: typeof DEMO_ACCOUNTS[0]) => {
    setCredentials({
      matricule: account.matricule,
      motDePasse: account.matricule === 'POL001' ? 'SecurePass2024!' :
                  account.matricule === 'POL002' ? 'Agent@2024' :
                  account.matricule === 'POL003' ? 'Patrol2024#' : 'Control@2024',
      codeService: account.matricule === 'POL001' ? 'DAKAR-CENTRAL' :
                   account.matricule === 'POL002' ? 'DAKAR-NORD' :
                   account.matricule === 'POL003' ? 'DAKAR-SUD' : 'CENTRALE-OPS'
    })
  }

  const getStepIcon = (stepId: string) => {
    if (stepId === 'credentials') return User
    if (stepId === '2fa') return KeyRound
    return CheckCircle
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Arrière-plan de sécurité */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header de sécurité */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            VIGIL ALERT HUB
          </h1>
          <p className="text-blue-200 text-sm">
            Système sécurisé - Forces de l'ordre uniquement
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Système opérationnel</span>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {LOGIN_STEPS.map((step, index) => {
              const Icon = getStepIcon(step.id)
              const isActive = step.id === currentStep
              const isCompleted = LOGIN_STEPS.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                    isActive ? "border-primary bg-primary text-white" :
                    isCompleted ? "border-green-400 bg-green-400 text-white" :
                    "border-gray-400 text-gray-400"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < LOGIN_STEPS.length - 1 && (
                    <div className={cn(
                      "w-8 h-px ml-2 transition-all",
                      isCompleted ? "bg-green-400" : "bg-gray-400"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {LOGIN_STEPS.find(s => s.id === currentStep)?.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {LOGIN_STEPS.find(s => s.id === currentStep)?.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Étape 1: Identifiants */}
            {currentStep === 'credentials' && (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">
                      Matricule officiel
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="POL001"
                        value={credentials.matricule}
                        onChange={(e) => setCredentials(prev => ({ 
                          ...prev, 
                          matricule: e.target.value.toUpperCase() 
                        }))}
                        className="pl-10 uppercase"
                        maxLength={6}
                      />
                    </div>
                    {errors.matricule && (
                      <p className="text-xs text-destructive mt-1">{errors.matricule}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={credentials.motDePasse}
                        onChange={(e) => setCredentials(prev => ({ 
                          ...prev, 
                          motDePasse: e.target.value 
                        }))}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? 
                          <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        }
                      </button>
                    </div>
                    {errors.motDePasse && (
                      <p className="text-xs text-destructive mt-1">{errors.motDePasse}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">
                      Code de service
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="DAKAR-CENTRAL"
                        value={credentials.codeService}
                        onChange={(e) => setCredentials(prev => ({ 
                          ...prev, 
                          codeService: e.target.value.toUpperCase() 
                        }))}
                        className="pl-10 uppercase"
                      />
                    </div>
                    {errors.codeService && (
                      <p className="text-xs text-destructive mt-1">{errors.codeService}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Vérification...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Authentifier
                      </>
                    )}
                  </Button>
                </form>

                {/* Comptes de démonstration */}
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-3 text-center">
                    Comptes de démonstration disponibles:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_ACCOUNTS.map((account) => (
                      <button
                        key={account.matricule}
                        onClick={() => fillDemoCredentials(account)}
                        className="p-2 bg-muted hover:bg-muted/80 rounded text-left transition-colors"
                      >
                        <div className="text-xs font-medium">{account.matricule}</div>
                        <div className="text-2xs text-muted-foreground">{account.grade}</div>
                        <Badge variant="outline" className="text-2xs mt-1">
                          {account.role}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Étape 2: 2FA */}
            {currentStep === '2fa' && (
              <>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <KeyRound className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Un code de vérification a été envoyé sur votre dispositif sécurisé
                  </p>
                </div>

                <form onSubmit={handle2FA} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">
                      Code de vérification (6 chiffres)
                    </label>
                    <Input
                      type="text"
                      placeholder="123456"
                      value={code2FA}
                      onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    {errors.code2FA && (
                      <p className="text-xs text-destructive mt-1">{errors.code2FA}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Vérification...
                      </>
                    ) : (
                      'Valider le code'
                    )}
                  </Button>
                </form>

                {attempts2FA > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-xs text-destructive">
                        Tentative {attempts2FA}/3. Code incorrect.
                      </span>
                    </div>
                  </div>
                )}

                {!show2FAHelp ? (
                  <button
                    onClick={() => setShow2FAHelp(true)}
                    className="text-xs text-primary hover:underline w-full text-center"
                  >
                    Code de test disponible
                  </button>
                ) : (
                  <div className="bg-primary/10 border border-primary/20 rounded p-3">
                    <p className="text-xs text-primary">
                      <strong>Code de test:</strong> 123456
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Étape 3: Succès */}
            {currentStep === 'success' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Accès autorisé
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Authentification réussie. Redirection en cours...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Chargement du tableau de bord...
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations de sécurité */}
        <div className="mt-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-xs text-white font-medium">
                Connexion sécurisée SSL/TLS
              </span>
            </div>
            <p className="text-2xs text-blue-200">
              Toutes les communications sont chiffrées et surveillées
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 