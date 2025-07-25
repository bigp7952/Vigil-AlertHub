# Vigil Alert Hub

**Plateforme de gestion des alertes et signalements pour les forces de l'ordre**

Une application web moderne permettant aux forces de l'ordre de gérer efficacement les signalements citoyens, les interventions d'urgence et les opérations de terrain en temps réel.

## 🚀 Fonctionnalités

### Authentification Sécurisée
- Système multi-niveaux avec matricule, mot de passe et code service
- Authentification à deux facteurs (2FA)
- Gestion des rôles : Admin, Superviseur, Agent, Opérateur
- Sessions sécurisées avec expiration automatique

### Dashboard Interactif
- Vue d'ensemble en temps réel des activités
- Graphiques et statistiques dynamiques
- Carte interactive des zones d'intervention
- Activités récentes avec actions rapides

### Gestion des Signalements
- Réception et traitement des alertes citoyennes
- Classification par niveau de priorité (critique, moyen, sécurisé)
- Assignation d'agents et suivi des interventions
- Vue carte et vue grille

### Cas Graves
- Gestion spécialisée des urgences critiques
- Intervention prioritaire et escalade
- Coordination des équipes d'urgence

### Système de Notifications
- Centre de notifications en temps réel
- Filtrage par type et priorité
- Actions contextuelles (assigner, localiser, contacter)
- Historique complet des notifications

### Interface Utilisateur
- Design moderne et professionnel
- Responsive (mobile/desktop)
- Animations fluides
- Palette de couleurs optimisée pour l'usage professionnel

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Cartes**: React Leaflet + OpenStreetMap
- **Graphiques**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Build**: Vite
- **État**: React Context + Hooks

## 📦 Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd vigil-alert-hub

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

## 🔐 Comptes de Test

### Admin (Accès Complet)
- **Matricule**: POL001
- **Mot de passe**: SecurePass2024!
- **Code service**: DAKAR-CENTRAL

### Superviseur
- **Matricule**: POL002
- **Mot de passe**: Agent@2024
- **Code service**: DAKAR-NORD

### Agent de Terrain
- **Matricule**: POL003
- **Mot de passe**: Patrol2024#
- **Code service**: DAKAR-SUD

### Opérateur
- **Matricule**: OPE001
- **Mot de passe**: Control@2024
- **Code service**: CENTRALE-OPS

**Code 2FA pour tous les comptes**: 123456

## 🏗️ Structure du Projet

```
src/
├── components/
│   ├── ui/                 # Composants UI réutilisables
│   ├── police/            # Composants spécifiques police
│   ├── map/               # Composants carte
│   └── notifications/     # Système de notifications
├── contexts/              # Contextes React (Auth, Notifications)
├── pages/                 # Pages principales
├── hooks/                 # Hooks personnalisés
└── lib/                   # Utilitaires
```

## 🎯 Permissions par Rôle

| Page | Admin | Superviseur | Agent | Opérateur |
|------|-------|-------------|-------|-----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Signalements | ✅ | ✅ | ✅ | ✅ |
| Cas Graves | ✅ | ✅ | ✅ | ✅ |
| Utilisateurs | ✅ | ✅ | ✅ | ✅ |
| Feedbacks | ✅ | ✅ | ✅ | ✅ |
| Historique | ✅ | ✅ | ✅ | ✅ |

## 🔄 Développement

```bash
# Lancer en développement
npm run dev

# Linter
npm run lint

# Build
npm run build

# Preview du build
npm run preview
```

## 🌍 Déploiement

```bash
# Build de production
npm run build

# Les fichiers générés seront dans le dossier `dist/`
```

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔒 Sécurité

- Authentification multi-facteurs
- Sessions avec timeout automatique
- Contrôle d'accès basé sur les rôles (RBAC)
- Validation côté client et simulation serveur
- Protection des routes sensibles

## 🤝 Contribution

Ce projet est développé pour les forces de l'ordre du Sénégal dans le cadre de la modernisation des systèmes de sécurité publique.
