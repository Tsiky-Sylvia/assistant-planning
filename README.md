# PlanifIA — Assistant de planification intelligent

Application web de planification hebdomadaire propulsée par l'IA. Décris tes tâches en langage naturel, l'IA les analyse, les priorise et les distribue automatiquement sur la semaine.

🔗 **Demo live**: https://assistant-planning.vercel.app

---

## Fonctionnalités

- Génération de planning via IA (Groq / Llama 3) à partir de texte libre
- Vue planning hebdomadaire interactive
- Drag & drop des tâches entre les jours
- Ajout et modification manuelle de tâches
- Marquage des tâches comme terminées
- Authentification complète (Clerk)
- Données persistées par utilisateur (PostgreSQL / Neon)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| Auth | Clerk |
| Base de données | PostgreSQL (Neon) |
| ORM | Prisma |
| IA | Groq API (Llama 3.3 70B) |
| Drag & drop | dnd-kit |
| Déploiement | Vercel |

---

## Défis techniques rencontrés

**1. Connexion PostgreSQL sans VPN**
Le port 5432 était bloqué sur le réseau local. Résolu en utilisant `@prisma/adapter-neon` qui passe par WebSockets (port 443) au lieu de TCP.

**2. Client Prisma corrompu après downgrade**
Après un downgrade de version Prisma, le client généré était désynchronisé. Résolu en supprimant le dossier `generated` et en relançant `npx prisma generate`.

**3. Fiabilité du JSON en sortie de l'IA**
L'IA pouvait retourner du texte non structuré. Résolu via un prompt système strict avec instruction de retourner uniquement du JSON pur, combiné à un parsing avec gestion d'erreur et fallback.

**4. Webhook Clerk bloqué par le middleware**
Le middleware Clerk redirigait les requêtes webhook vers `/sign-in`. Résolu en ajoutant `/api/webhooks(.*)` dans les routes publiques du middleware.

**5. Drag & drop non déclenché**
Le `DragOverlay` de dnd-kit interceptait les événements pointer et empêchait la détection des zones de drop. Résolu en le supprimant et en gérant l'effet visuel directement sur la carte.

**6. Erreur de nommage de route**
La route `routes.ts` au lieu de `route.ts` rendait l'endpoint invisible pour Next.js.

---

## Installation locale

```bash
git clone https://github.com/TON-USERNAME/assistant-planning.git
cd assistant-planning
npm install
```

Configure les variables d'environnement dans `.env.local`:

DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
GROQ_API_KEY=

Lance le projet:

```bash
** Utilisez VPN pour les 2 premiers commandes si sur windows, sans VPN le réseau local bloque le port 5232**
npx prisma generate 
npx prisma migrate dev
npm run dev
```

---

## Architecture

app/
├── api/
│   ├── tasks/
│   │   ├── generate/route.ts   # Génération IA
│   │   ├── manual/route.ts     # Ajout manuel
│   │   ├── route.ts            # GET/POST tâches
│   │   └── [id]/route.ts       # PATCH/DELETE tâche
│   └── webhooks/clerk/route.ts # Sync utilisateurs
├── dashboard/page.tsx
├── sign-in/[[...sign-in]]/page.tsx
├── sign-up/[[...sign-up]]/page.tsx
├── error.tsx
├── global-error.tsx
├── not-found.tsx
└── page.tsx                    # Landing page
components/
├── TaskInput.tsx
├── TaskCard.tsx
├── TaskModal.tsx
├── WeeklyPlanner.tsx
└── Spinner.tsx
lib/
├── prisma.ts
└── prompts.ts