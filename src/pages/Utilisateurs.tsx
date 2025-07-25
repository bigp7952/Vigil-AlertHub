import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Users, Search, Star, MapPin, Calendar, MessageCircle, Send, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data pour les utilisateurs citoyens
const mockUtilisateurs = [
  {
    id: "1",
    nom: "Marie Diallo",
    email: "marie.diallo@email.com",
    telephone: "+221 77 123 45 67",
    quartier: "Sandaga",
    dateInscription: "2024-01-15",
    nombreSignalements: 5,
    fiabilite: 95,
    dernierSignalement: "2024-01-20"
  },
  {
    id: "2",
    nom: "Amadou Ba",
    email: "amadou.ba@email.com", 
    telephone: "+221 76 987 65 43",
    quartier: "Autoroute",
    dateInscription: "2023-12-10",
    nombreSignalements: 12,
    fiabilite: 88,
    dernierSignalement: "2024-01-20"
  },
  {
    id: "3",
    nom: "Fatou Sow",
    email: "fatou.sow@email.com",
    telephone: "+221 78 456 78 90",
    quartier: "Almadies",
    dateInscription: "2024-01-05",
    nombreSignalements: 3,
    fiabilite: 100,
    dernierSignalement: "2024-01-19"
  },
  {
    id: "4",
    nom: "Ibrahima Ndour",
    email: "ibrahima.ndour@email.com",
    telephone: "+221 77 234 56 78",
    quartier: "Pompiers",
    dateInscription: "2023-11-20",
    nombreSignalements: 8,
    fiabilite: 92,
    dernierSignalement: "2024-01-18"
  },
  {
    id: "5",
    nom: "Aïssa Mbaye",
    email: "aissa.mbaye@email.com",
    telephone: "+221 76 345 67 89",
    quartier: "Place Indépendance",
    dateInscription: "2023-10-15",
    nombreSignalements: 15,
    fiabilite: 85,
    dernierSignalement: "2024-01-20"
  }
]

const getFiabiliteColor = (fiabilite: number) => {
  if (fiabilite >= 90) return "text-safe-zone"
  if (fiabilite >= 75) return "text-warning"
  return "text-danger-critical"
}

const getFiabiliteBadge = (fiabilite: number) => {
  if (fiabilite >= 90) return "success"
  if (fiabilite >= 75) return "warning"
  return "destructive"
}

// Composant pour l'historique des signalements
function HistoriqueDialog({ utilisateur }: { utilisateur: any }) {
  const mockHistorique = [
    { id: 1, date: "2024-01-20", type: "Vol", status: "traité", description: "Vol à la tire signalé" },
    { id: 2, date: "2024-01-18", type: "Accident", status: "en cours", description: "Accident de circulation mineur" },
    { id: 3, date: "2024-01-15", type: "Trouble", status: "traité", description: "Tapage nocturne signalé" },
  ]

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-sm">Historique de {utilisateur.nom}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-3">
        <div className="text-xs text-muted-foreground">
          {utilisateur.nombreSignalements} signalement{utilisateur.nombreSignalements > 1 ? 's' : ''} au total
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {mockHistorique.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded text-2xs">
              <div>
                <div className="font-medium">{item.type}</div>
                <div className="text-muted-foreground">{item.date}</div>
              </div>
              <Badge variant={item.status === "traité" ? "success" : "warning"} className="text-2xs">
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// Composant pour envoyer un message
function MessageDialog({ utilisateur }: { utilisateur: any }) {
  const [messageContent, setMessageContent] = useState("")
  const [messageSubject, setMessageSubject] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    // Simulation d'envoi de message
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Message envoyé",
        description: `Votre message a été envoyé à ${utilisateur.nom}`,
      })
      
      setMessageContent("")
      setMessageSubject("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Message à {utilisateur.nom}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="bg-muted p-3 rounded text-xs">
          <div className="font-medium">{utilisateur.nom}</div>
          <div className="text-muted-foreground">{utilisateur.email}</div>
          <div className="text-muted-foreground">{utilisateur.telephone}</div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground">Sujet</label>
            <Input
              placeholder="Objet du message..."
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-foreground">Message</label>
            <Textarea
              placeholder="Tapez votre message ici..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="mt-1 min-h-24"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>Envoi en cours...</>
            ) : (
              <>
                <Send className="h-3 w-3 mr-1" />
                Envoyer
              </>
            )}
          </Button>
        </div>
        
        <div className="text-2xs text-muted-foreground">
          Le message sera envoyé par SMS et email à l'utilisateur.
        </div>
      </div>
    </>
  )
}

function UtilisateurDetailPopup({ utilisateur }: { utilisateur: any }) {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [historiqueDialogOpen, setHistoriqueDialogOpen] = useState(false)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-sm">Profil de {utilisateur.nom}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {utilisateur.nom.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{utilisateur.nom}</h3>
                <p className="text-xs text-muted-foreground">ID: {utilisateur.id}</p>
                <Badge variant={getFiabiliteBadge(utilisateur.fiabilite)} className="text-2xs mt-1">
                  Fiabilité: {utilisateur.fiabilite}%
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-foreground">Contact</h4>
                <p className="text-2xs text-muted-foreground">{utilisateur.email}</p>
                <p className="text-2xs text-muted-foreground">{utilisateur.telephone}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-foreground">Localisation</h4>
                <p className="text-2xs text-muted-foreground">Quartier: {utilisateur.quartier}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{utilisateur.nombreSignalements}</p>
                <p className="text-2xs text-muted-foreground">Signalements</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-safe-zone">{utilisateur.fiabilite}%</p>
                <p className="text-2xs text-muted-foreground">Fiabilité</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">{utilisateur.dernierSignalement}</p>
                <p className="text-2xs text-muted-foreground">Dernier signal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Dialog open={historiqueDialogOpen} onOpenChange={setHistoriqueDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <History className="h-3 w-3 mr-1" />
                Historique
          </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <HistoriqueDialog utilisateur={utilisateur} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex-1">
                <MessageCircle className="h-3 w-3 mr-1" />
                Message
          </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <MessageDialog utilisateur={utilisateur} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}

export default function Utilisateurs() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUtilisateurs = mockUtilisateurs.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.quartier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Header compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Utilisateurs Citoyens
          </h1>
          <p className="text-xs text-muted-foreground">
            {filteredUtilisateurs.length} utilisateur{filteredUtilisateurs.length > 1 ? 's' : ''} actif{filteredUtilisateurs.length > 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant="outline">
          <Star className="h-3 w-3 mr-1" />
          {(mockUtilisateurs.reduce((acc, u) => acc + u.fiabilite, 0) / mockUtilisateurs.length).toFixed(0)}% fiabilité moy.
        </Badge>
      </div>

      {/* Statistiques compactes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{mockUtilisateurs.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-safe-zone">
              {mockUtilisateurs.filter(u => u.fiabilite >= 90).length}
              </div>
              <div className="text-xs text-muted-foreground">Très fiables</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
              {mockUtilisateurs.reduce((total, u) => total + u.nombreSignalements, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Signalements</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
              {mockUtilisateurs.filter(u => u.dernierSignalement === "2024-01-20").length}
              </div>
              <div className="text-xs text-muted-foreground">Actifs aujourd'hui</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche compacte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="h-3 w-3" />
            Rechercher un utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nom, email ou quartier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-7"
          />
        </CardContent>
      </Card>

      {/* Liste des utilisateurs - plus compacte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredUtilisateurs.map((utilisateur, index) => (
          <Card 
            key={utilisateur.id} 
            className="hover:shadow-lg transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {utilisateur.nom.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-foreground truncate">{utilisateur.nom}</h3>
                  <div className="flex items-center gap-1 text-2xs text-muted-foreground">
                    <MapPin className="h-2 w-2" />
                    {utilisateur.quartier}
                  </div>
                </div>
                <Badge variant={getFiabiliteBadge(utilisateur.fiabilite)} className="text-2xs">
                  {utilisateur.fiabilite}%
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-2xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Signalements:</span>
                  <span className="font-medium text-foreground">{utilisateur.nombreSignalements}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-2 w-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{utilisateur.dateInscription}</span>
                </div>
              </div>
              
              <p className="text-2xs text-muted-foreground">
                Dernier: {utilisateur.dernierSignalement}
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="xs" className="w-full">
                    Voir profil
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <UtilisateurDetailPopup utilisateur={utilisateur} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUtilisateurs.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">Aucun utilisateur trouvé avec ce filtre.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}