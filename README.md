# Mafia GM Companion

A sleek Game Master companion app for real-life Mafia/Town of Salem games. Built with React and designed for mobile use.

![Mafia GM](https://img.shields.io/badge/React-19.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

### For Game Masters
- **Player Management**: Add and remove players with an intuitive interface
- **Automatic Role Distribution**: Balanced role assignment based on player count
- **Role Dashboard**: View all player assignments at a glance
- **Re-roll**: Generate new role assignments with the same players
- **Mobile-First Design**: Optimized for holding on your phone during games

### For Players
- **Role Guide**: Learn about all available roles
- **Detailed Explanations**: Understand win conditions and investigator results
- **Faction Overview**: Browse Town, Mafia, and Neutral roles

## Role Distribution

| Players | Mafia | Doctor | Investigator | Jester | Executioner | Villagers |
|---------|-------|--------|--------------|--------|-------------|-----------|
| 5-6     | 1     | 1      | -            | -      | -           | Rest      |
| 7-8     | 2     | 1      | 1            | 1      | -           | Rest      |
| 9       | 3     | 1      | 1            | 1      | -           | Rest      |
| 10+     | 3     | 1      | 1            | 1      | 1           | Rest      |

## Roles

### Town (Goal: Eliminate all evil)
- **Villager** - No special abilities
- **Doctor** - Heals one player each night
- **Investigator** - Checks if a player is "Good" or "Not Good"

### Mafia (Goal: Outnumber the Town)
- **Mafioso** - Kills one player each night with fellow Mafia

### Neutral (Individual goals)
- **Jester** - Wins by getting lynched
- **Executioner** - Wins by getting their assigned target lynched

## Investigator Results
- **Good**: Villager, Doctor, Investigator
- **Not Good**: Mafioso, Jester, Executioner

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Live Demo

Visit the app at: [https://eliasreuss.github.io/mafia_app/](https://eliasreuss.github.io/mafia_app/)

## License

MIT
