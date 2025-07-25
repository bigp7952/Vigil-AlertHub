import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, MapPin, Clock, User, Eye, Grid3X3, Map } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import InteractiveMap from "@/components/map/InteractiveMap"

// Mock data étendu
const mockSignalements = [
  {
    id: "1",
    citoyen: "Marie Diallo",
    heure: "14:30",
    description: "Activité suspecte près du marché Sandaga. Plusieurs individus observent les passants de manière inhabituelle.",
    niveau: "danger-medium" as const,
    status: "non traité" as const,
    localisation: { lat: 14.7167, lng: -17.4677, nom: "Marché Sandaga" },
    photo: null
  },
  {
    id: "2", 
    citoyen: "Amadou Ba",
    heure: "13:45",
    description: "Accident de voiture grave sur l'autoroute. Plusieurs véhicules impliqués, blessés sur place.",
    niveau: "danger-critical" as const,
    status: "en cours" as const,
    localisation: { lat: 14.7204, lng: -17.4581, nom: "Autoroute A1" },
    photo: null
  },
  {
    id: "3",
    citoyen: "Fatou Sow",
    heure: "12:15", 
    description: "Zone du quartier Almadies maintenant sécurisée après intervention",
    niveau: "safe-zone" as const,
    status: "traité" as const,
    localisation: { lat: 14.7076, lng: -17.4794, nom: "Quartier Almadies" },
    photo: null
  },
  {
    id: "4",
    citoyen: "Ibrahima Ndour",
    heure: "11:30",
    description: "Vol à la tire signalé près de la gare routière Pompiers",
    niveau: "danger-medium" as const,
    status: "non traité" as const,
    localisation: { lat: 14.6928, lng: -17.4467, nom: "Gare Routière" },
    photo: null
  },
  {
    id: "5",
    citoyen: "Aïssa Mbaye",
    heure: "10:45",
    description: "Manifestation non déclarée en cours place de l'Indépendance",
    niveau: "danger-critical" as const,
    status: "en cours" as const,
    localisation: { lat: 14.6937, lng: -17.4441, nom: "Place Indépendance" },
    photo: null
  }
]

const getBadgeVariant = (niveau: string) => {
  switch(niveau) {
    case "danger-critical": return "destructive"
    case "danger-medium": return "warning" 
    case "safe-zone": return "success"
    default: return "secondary"
  }
}

const getNiveauLabel = (niveau: string) => {
  switch(niveau) {
    case "danger-critical": return "Critique"
    case "danger-medium": return "Suspect"
    case "safe-zone": return "Sécurisé"
    default: return niveau
  }
}

const getStatusLabel = (status: string) => {
  switch(status) {
    case "non traité": return "Non traité"
    case "en cours": return "En cours"
    case "traité": return "Traité"
    default: return status
  }
}

export default function Signalements() {
  const location = useLocation()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Récupération des paramètres de navigation depuis la carte
  const navigationState = location.state as {
    viewMode?: "grid" | "map"
    highlightLocation?: string
    activityId?: number
  } | null

  useEffect(() => {
    if (navigationState?.viewMode) {
      setViewMode(navigationState.viewMode)
    }
  }, [navigationState])

  const filteredSignalements = mockSignalements.filter(signalement => {
    const matchesSearch = signalement.citoyen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signalement.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || signalement.status === filterStatus
    const matchesNiveau = filterType === "all" || signalement.niveau === filterType
    
    return matchesSearch && matchesStatus && matchesNiveau
  })

  // Fonction pour gérer le clic sur un signalement de la carte
  const handleSignalementClick = (signalement: any) => {
    toast({
      title: "Zone sélectionnée",
      description: `${signalement.nom} - ${signalement.description}`,
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            Signalements
            {navigationState?.highlightLocation && (
              <Badge variant="outline" className="ml-2">
                Focus: {navigationState.highlightLocation}
              </Badge>
            )}
          </h1>
          <p className="text-xs text-muted-foreground">
            Gestion des signalements citoyens
          </p>
        </div>
        
        {/* Toggle View Mode */}
        <div className="flex gap-1 bg-muted p-1 rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="xs"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-3 w-3 mr-1" />
            Grille
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="xs"
            onClick={() => setViewMode("map")}
          >
            <Map className="h-3 w-3 mr-1" />
            Carte
          </Button>
        </div>
      </div>

      {/* Statistiques principales - plus compactes */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{mockSignalements.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-danger-critical">
                {mockSignalements.filter(s => s.niveau === "danger-critical").length}
              </div>
              <div className="text-xs text-muted-foreground">Critiques</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                {mockSignalements.filter(s => s.status === "en_cours").length}
              </div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-safe-zone">
                {mockSignalements.filter(s => s.status === "resolu").length}
              </div>
              <div className="text-xs text-muted-foreground">Résolus</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="h-3 w-3" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Rechercher</label>
              <Input
                placeholder="Citoyen ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-7"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Niveau</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="danger-critical">Critique</SelectItem>
                  <SelectItem value="danger-medium">Moyen</SelectItem>
                  <SelectItem value="safe-zone">Sécurisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Statut</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="resolu">Résolu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      {viewMode === "map" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Carte des signalements
              {navigationState?.highlightLocation && (
                <span className="text-xs text-muted-foreground">
                  - {navigationState.highlightLocation}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-md overflow-hidden">
              <InteractiveMap 
                highlightLocation={navigationState?.highlightLocation}
                activityId={navigationState?.activityId}
                onSignalementClick={handleSignalementClick}
              />
            </div>
            
            {navigationState?.highlightLocation && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Localisation mise en évidence</h4>
                    <p className="text-xs text-muted-foreground">
                      {navigationState.highlightLocation} - Activité #{navigationState.activityId}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSignalements.map((signalement, index) => (
            <Card 
              key={signalement.id} 
              className={cn(
                "hover:shadow-lg transition-all duration-200 animate-fade-in",
                navigationState?.activityId === signalement.id && "ring-2 ring-primary/50 bg-primary/5"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{signalement.citoyen}</h3>
                      <p className="text-xs text-muted-foreground">{signalement.description}</p>
                    </div>
                    <Badge
                      variant={
                        signalement.niveau === "danger-critical" ? "destructive" :
                        signalement.niveau === "danger-medium" ? "warning" : "success"
                      }
                      className="text-2xs"
                    >
                      {signalement.niveau === "danger-critical" ? "Critique" :
                       signalement.niveau === "danger-medium" ? "Moyen" : "Sécurisé"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-2xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {signalement.localisation.nom}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {signalement.heure}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        signalement.status === "resolu" ? "success" :
                        signalement.status === "en_cours" ? "warning" : "destructive"
                      }
                      className="text-2xs"
                    >
                      {signalement.status === "nouveau" ? "Nouveau" :
                       signalement.status === "en_cours" ? "En cours" : "Résolu"}
                    </Badge>
                    
                    {/* Removed Dialog component as per new_code */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}