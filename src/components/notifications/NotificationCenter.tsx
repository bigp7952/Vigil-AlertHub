import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MapPin,
  User,
  MoreVertical,
  Archive,
  Eye,
  ExternalLink,
  Trash2,
  UserCheck,
  Map,
  Phone,
  MessageCircle,
  Navigation,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNotifications, type Notification } from '@/contexts/NotificationContext'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
  onArchive: (id: string) => void
}

// Dialog détaillé pour une notification
function NotificationDetailDialog({ notification }: { notification: Notification }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedAgent, setSelectedAgent] = useState("")
  const [notes, setNotes] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)

  const availableAgents = [
    "Agent Martin (Secteur Nord)",
    "Agent Diop (Centre-ville)", 
    "Agent Fall (Secteur Sud)",
    "Agent Ndiaye (Secteur Est)",
    "Agent Sy (Secteur Ouest)"
  ]

  const handleViewOnMap = () => {
    if (notification.location) {
      navigate('/signalements', { 
        state: { 
          viewMode: 'map', 
          highlightLocation: notification.location,
          activityId: notification.relatedId
        } 
      })
      toast({
        title: "Navigation vers la carte",
        description: `Localisation: ${notification.location}`,
      })
    }
  }

  const handleAssignAgent = async () => {
    if (!selectedAgent) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un agent",
        variant: "destructive"
      })
      return
    }

    setIsAssigning(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Agent assigné",
        description: `${selectedAgent} a été assigné à cette intervention`,
      })
      
      setSelectedAgent("")
      setNotes("")
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'assigner l'agent",
        variant: "destructive"
      })
    } finally {
      setIsAssigning(false)
    }
  }

  const handleContactCitizen = () => {
    toast({
      title: "Contact citoyen",
      description: "Ouverture du module de communication...",
    })
  }

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'emergency':
        return <AlertTriangle className="h-6 w-6 text-destructive" />
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-warning" />
      case 'success':
        return <CheckCircle className="h-6 w-6 text-success" />
      default:
        return <Info className="h-6 w-6 text-primary" />
    }
  }

  const getPriorityLabel = () => {
    switch (notification.priority) {
      case 'critical': return 'CRITIQUE'
      case 'high': return 'ÉLEVÉE'
      case 'medium': return 'MOYENNE'
      case 'low': return 'FAIBLE'
      default: return notification.priority.toUpperCase()
    }
  }

  const getSourceLabel = () => {
    switch (notification.source) {
      case 'citizen': return 'Citoyen'
      case 'agent': return 'Agent'
      case 'dispatch': return 'Dispatch'
      case 'system': return 'Système'
      default: return notification.source
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-base flex items-center gap-3">
          {getTypeIcon()}
          <div>
            <div className="font-semibold">{notification.title}</div>
            <div className="text-xs text-muted-foreground font-normal">
              ID: {notification.relatedId || notification.id}
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Informations principales */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Informations générales</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <div className="font-medium capitalize">{notification.type}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Priorité:</span>
              <Badge variant={
                notification.priority === 'critical' ? 'destructive' :
                notification.priority === 'high' ? 'warning' :
                notification.priority === 'medium' ? 'default' : 'secondary'
              }>
                {getPriorityLabel()}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Source:</span>
              <div className="font-medium">{getSourceLabel()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Reçu:</span>
              <div className="font-medium">
                {format(notification.timestamp, 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </div>
            </div>
          </div>
        </div>

        {/* Message détaillé */}
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed bg-background border rounded p-3">
            {notification.message}
          </p>
        </div>

        {/* Localisation */}
        {notification.location && (
          <div>
            <h4 className="text-sm font-medium mb-2">Localisation</h4>
            <div className="flex items-center gap-2 p-3 bg-background border rounded">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{notification.location}</span>
              <Button 
                variant="outline" 
                size="xs" 
                onClick={handleViewOnMap}
                className="ml-auto"
              >
                <Map className="h-3 w-3 mr-1" />
                Voir sur carte
              </Button>
            </div>
          </div>
        )}

        {/* Actions disponibles selon le type */}
        {notification.actionRequired && notification.type !== 'success' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Actions disponibles</h4>
            
            {/* Actions rapides */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleViewOnMap}>
                <Navigation className="h-3 w-3 mr-1" />
                Localiser
              </Button>
              
              {notification.source === 'citizen' && (
                <Button variant="outline" size="sm" onClick={handleContactCitizen}>
                  <Phone className="h-3 w-3 mr-1" />
                  Contacter
                </Button>
              )}
              
              <Button variant="outline" size="sm">
                <MessageCircle className="h-3 w-3 mr-1" />
                Dispatcher
              </Button>
              
              <Button variant="outline" size="sm">
                <Shield className="h-3 w-3 mr-1" />
                Escalader
              </Button>
            </div>

            {/* Assignation d'agent */}
            {notification.type === 'emergency' || notification.type === 'warning' ? (
              <div className="border rounded-lg p-4 space-y-3">
                <h5 className="text-sm font-medium">Assigner un agent</h5>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground">Agent disponible</label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un agent..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAgents.map((agent) => (
                          <SelectItem key={agent} value={agent}>
                            {agent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-foreground">Instructions</label>
                    <Textarea
                      placeholder="Instructions spécifiques pour l'intervention..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 min-h-20"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAssignAgent}
                    disabled={!selectedAgent || isAssigning}
                    className="w-full"
                    size="sm"
                  >
                    {isAssigning ? (
                      <>Attribution en cours...</>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3 mr-1" />
                        Assigner l'intervention
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Statut final pour les notifications traitées */}
        {notification.type === 'success' && (
          <div className="bg-success/10 border border-success/20 rounded p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Intervention terminée avec succès</span>
            </div>
          </div>
        )}

        {/* Métadonnées */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>ID Notification: {notification.id}</div>
            <div>Reçu: {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: fr })}</div>
            {notification.relatedId && (
              <div>ID Signalement: {notification.relatedId}</div>
            )}
            <div>Source: {getSourceLabel()}</div>
          </div>
        </div>
      </div>
    </>
  )
}

function NotificationItem({ notification, onMarkRead, onArchive }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />
      default:
        return <Info className="h-4 w-4 text-primary" />
    }
  }

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'critical':
        return 'border-l-4 border-l-destructive bg-destructive/5'
      case 'high':
        return 'border-l-4 border-l-warning bg-warning/5'
      case 'medium':
        return 'border-l-4 border-l-primary bg-primary/5'
      default:
        return 'border-l-4 border-l-muted bg-muted/5'
    }
  }

  const getSourceIcon = () => {
    switch (notification.source) {
      case 'citizen':
        return <User className="h-3 w-3" />
      case 'agent':
        return <User className="h-3 w-3" />
      case 'dispatch':
        return <Bell className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  return (
    <Card 
      className={cn(
        "mb-2 transition-all duration-200 hover:shadow-md",
        getPriorityColor(),
        !notification.isRead && "ring-1 ring-primary/20"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className={cn(
                "text-sm font-medium leading-tight",
                !notification.isRead && "font-semibold"
              )}>
                {notification.title}
              </h4>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="xs" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.isRead && (
                    <DropdownMenuItem onClick={() => onMarkRead(notification.id)}>
                      <Eye className="h-3 w-3 mr-2" />
                      Marquer comme lu
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onArchive(notification.id)}>
                    <Archive className="h-3 w-3 mr-2" />
                    Archiver
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Voir détails
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <NotificationDetailDialog notification={notification} />
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {notification.message}
            </p>
            
            <div className="flex items-center gap-3 text-2xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(notification.timestamp, { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </div>
              
              {notification.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-32">{notification.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                {getSourceIcon()}
                <span className="capitalize">{notification.source}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  notification.priority === 'critical' ? 'destructive' :
                  notification.priority === 'high' ? 'warning' :
                  notification.priority === 'medium' ? 'default' : 'secondary'
                }
                className="text-2xs"
              >
                {notification.priority}
              </Badge>
              
              {notification.actionRequired && (
                <Badge variant="outline" className="text-2xs">
                  Action requise
                </Badge>
              )}
              
              {!notification.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    emergencyCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    getNotificationsByType,
    getRecentNotifications
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'emergency':
        return getNotificationsByType('emergency')
      case 'warning':
        return getNotificationsByType('warning')
      case 'info':
        return getNotificationsByType('info')
      case 'success':
        return getNotificationsByType('success')
      case 'unread':
        return notifications.filter(n => !n.isRead)
      default:
        return getRecentNotifications(20)
    }
  }

  const filteredNotifications = getFilteredNotifications()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="xs" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant={emergencyCount > 0 ? "destructive" : "default"}
              className="absolute -top-1 -right-1 h-5 w-5 text-2xs rounded-full p-0 flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          {emergencyCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-2xs">
                    {unreadCount} non lues
                  </Badge>
                )}
              </CardTitle>
              
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="xs"
                  onClick={markAllAsRead}
                  className="text-2xs"
                >
                  Tout marquer lu
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
                <TabsTrigger value="all" className="text-2xs">
                  Toutes
                  {notifications.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-2xs">
                      {notifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="emergency" className="text-2xs">
                  🚨
                  {getNotificationsByType('emergency').length > 0 && (
                    <Badge variant="destructive" className="ml-1 text-2xs">
                      {getNotificationsByType('emergency').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="warning" className="text-2xs">
                  ⚠️
                  {getNotificationsByType('warning').length > 0 && (
                    <Badge variant="warning" className="ml-1 text-2xs">
                      {getNotificationsByType('warning').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="info" className="text-2xs">
                  ℹ️
                  {getNotificationsByType('info').length > 0 && (
                    <Badge variant="outline" className="ml-1 text-2xs">
                      {getNotificationsByType('info').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="success" className="text-2xs">
                  ✅
                  {getNotificationsByType('success').length > 0 && (
                    <Badge variant="success" className="ml-1 text-2xs">
                      {getNotificationsByType('success').length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <ScrollArea className="h-96">
                  <div className="p-3">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Aucune notification
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={markAsRead}
                            onArchive={archiveNotification}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
} 