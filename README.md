# Mafia GM Companion

A sleek Game Master companion app for real-life Mafia/Town of Salem games. Built with React and designed for mobile use.

![Mafia GM](https://img.shields.io/badge/React-19.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

### For Game Masters
- **Player Management**: Add and remove players with an intuitive interface
- **Standard Game Mode**: Automatic balanced role distribution based on player count
- **Custom Game Mode**: Build your own game with any combination of 19 different roles
- **Role Dashboard**: View all player assignments at a glance
- **Re-roll**: Generate new role assignments with the same players
- **Mobile-First Design**: Optimized for holding on your phone during games

### For Players
- **Role Guide**: Learn about all 19 available roles
- **Detailed Explanations**: Understand abilities, win conditions, and investigator results
- **Faction Overview**: Browse Town, Mafia, and Neutral roles

## Game Modes

### Standard Mode (5+ players)
Balanced role distribution:

| Players | Mafia | Doctor | Investigator | Jester | Executioner | Villagers |
|---------|-------|--------|--------------|--------|-------------|-----------|
| 5-6     | 1     | 1      | -            | -      | -           | Rest      |
| 7-8     | 2     | 1      | 1            | 1      | -           | Rest      |
| 9       | 3     | 1      | 1            | 1      | -           | Rest      |
| 10+     | 3     | 1      | 1            | 1      | 1           | Rest      |

### Custom Mode (3+ players)
Build your own game! Choose from all 19 roles and set the exact count for each.

## All Roles

### Town (Goal: Eliminate all evil)
| Role | Ability | Investigator Result |
|------|---------|---------------------|
| Villager | None | Good |
| Doctor | Heals one player each night | Good |
| Investigator | Checks if player is Good/Not Good | Good |
| Bodyguard | Protects a player, both die if attacked | Good |
| Lookout | Sees who visits a player at night | Good |
| Escort | Roleblocks a player each night | Good |
| Mayor | Can reveal for 3x voting power | Good |
| Veteran | Goes on alert, kills all visitors | Good |

### Mafia (Goal: Outnumber the Town)
| Role | Ability | Investigator Result |
|------|---------|---------------------|
| Mafioso | Kills for the Mafia | Not Good |
| Godfather | Kills, appears innocent | Good |
| Consort | Mafia roleblock | Not Good |
| Framer | Makes target appear evil | Not Good |
| Janitor | Hides victim's role | Not Good |

### Neutral (Individual goals)
| Role | Goal | Investigator Result |
|------|------|---------------------|
| Jester | Get yourself lynched | Not Good |
| Executioner | Get your target lynched | Not Good |
| Serial Killer | Be last standing | Not Good |
| Survivor | Survive to the end | Good |
| Witch | Survive, see Town lose | Not Good |
| Arsonist | Be last standing | Not Good |

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
