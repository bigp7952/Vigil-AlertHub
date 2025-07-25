import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface PoliceHeaderProps {
  agentName?: string
  onLogout?: () => void
}

export function PoliceHeader({ agentName = "Agent Martin", onLogout }: PoliceHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-foreground">Interface Forces de l'Ordre</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {agentName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{agentName}</p>
            <p className="text-xs text-muted-foreground">Forces de l'ordre</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onLogout}
          className="ml-4"
        >
          Déconnexion
        </Button>
      </div>
    </header>
  )
}