import { useState, useCallback } from 'react';

// Role definitions with metadata
export const ROLES = {
  // Town roles
  VILLAGER: {
    name: 'Villager',
    faction: 'town',
    description: 'A regular townsperson with no special abilities.',
    ability: null,
  },
  DOCTOR: {
    name: 'Doctor',
    faction: 'town',
    description: 'Can protect one player from death each night.',
    ability: 'Heal',
  },
  INVESTIGATOR: {
    name: 'Investigator',
    faction: 'town',
    description: 'Can check one player\'s alignment each night.',
    ability: 'Investigate',
  },
  // Mafia roles
  MAFIOSO: {
    name: 'Mafioso',
    faction: 'mafia',
    description: 'Works with other Mafia to eliminate the Town.',
    ability: 'Kill',
  },
  // Neutral roles
  JESTER: {
    name: 'Jester',
    faction: 'neutral',
    description: 'Wins by getting themselves lynched by the Town.',
    ability: null,
  },
  EXECUTIONER: {
    name: 'Executioner',
    faction: 'neutral',
    description: 'Wins by getting their target lynched.',
    ability: null,
    hasTarget: true,
  },
};

// Get role distribution based on player count
function getRoleDistribution(playerCount) {
  const distribution = {
    mafia: 0,
    doctor: 0,
    investigator: 0,
    jester: 0,
    executioner: 0,
    villagers: 0,
  };

  if (playerCount >= 5 && playerCount <= 6) {
    // 5-6 Players: 1 Mafia, 1 Doctor, Remainder Villagers (No Neutrals)
    distribution.mafia = 1;
    distribution.doctor = 1;
    distribution.villagers = playerCount - 2;
  } else if (playerCount >= 7 && playerCount <= 8) {
    // 7-8 Players: 2 Mafia, 1 Doctor, 1 Investigator, 1 Jester, Remainder Villagers
    distribution.mafia = 2;
    distribution.doctor = 1;
    distribution.investigator = 1;
    distribution.jester = 1;
    distribution.villagers = playerCount - 5;
  } else if (playerCount === 9) {
    // 9 Players: 3 Mafia, 1 Doctor, 1 Investigator, 1 Jester (no Exe), Remainder Villagers
    distribution.mafia = 3;
    distribution.doctor = 1;
    distribution.investigator = 1;
    distribution.jester = 1;
    distribution.villagers = playerCount - 6;
  } else if (playerCount >= 10) {
    // 10+ Players: 3 Mafia, 1 Doctor, 1 Investigator, 1 Jester, 1 Executioner, Remainder Villagers
    distribution.mafia = 3;
    distribution.doctor = 1;
    distribution.investigator = 1;
    distribution.jester = 1;
    distribution.executioner = 1;
    distribution.villagers = playerCount - 7;
  }

  return distribution;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Assign roles to players
function assignRoles(players) {
  const playerCount = players.length;
  const distribution = getRoleDistribution(playerCount);
  
  // Build the role pool
  const rolePool = [];
  
  // Add Mafia
  for (let i = 0; i < distribution.mafia; i++) {
    rolePool.push({ ...ROLES.MAFIOSO });
  }
  
  // Add Doctor
  for (let i = 0; i < distribution.doctor; i++) {
    rolePool.push({ ...ROLES.DOCTOR });
  }
  
  // Add Investigator
  for (let i = 0; i < distribution.investigator; i++) {
    rolePool.push({ ...ROLES.INVESTIGATOR });
  }
  
  // Add Jester
  for (let i = 0; i < distribution.jester; i++) {
    rolePool.push({ ...ROLES.JESTER });
  }
  
  // Add Executioner
  for (let i = 0; i < distribution.executioner; i++) {
    rolePool.push({ ...ROLES.EXECUTIONER });
  }
  
  // Add Villagers
  for (let i = 0; i < distribution.villagers; i++) {
    rolePool.push({ ...ROLES.VILLAGER });
  }
  
  // Shuffle both players and roles
  const shuffledPlayers = shuffleArray(players);
  const shuffledRoles = shuffleArray(rolePool);
  
  // Assign roles to players
  const assignments = shuffledPlayers.map((player, index) => ({
    id: player.id,
    name: player.name,
    role: shuffledRoles[index],
    target: null,
  }));
  
  // Handle Executioner target assignment
  const executioner = assignments.find(a => a.role.name === 'Executioner');
  if (executioner) {
    // Get all Town players (excluding the Executioner)
    const townPlayers = assignments.filter(
      a => a.role.faction === 'town' && a.id !== executioner.id
    );
    
    if (townPlayers.length > 0) {
      // Randomly select a Town player as the target
      const randomTarget = townPlayers[Math.floor(Math.random() * townPlayers.length)];
      executioner.target = {
        id: randomTarget.id,
        name: randomTarget.name,
      };
    }
  }
  
  // Sort assignments alphabetically by name
  return assignments.sort((a, b) => a.name.localeCompare(b.name));
}

// Custom hook for game logic
export function useGameLogic() {
  const [players, setPlayers] = useState([]);
  const [assignments, setAssignments] = useState(null);
  const [gamePhase, setGamePhase] = useState('setup'); // 'setup' or 'playing'

  const addPlayer = useCallback((name) => {
    const trimmedName = name.trim();
    if (trimmedName && !players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setPlayers(prev => [
        ...prev,
        { id: crypto.randomUUID(), name: trimmedName }
      ]);
      return true;
    }
    return false;
  }, [players]);

  const removePlayer = useCallback((id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const startGame = useCallback(() => {
    if (players.length >= 5) {
      const newAssignments = assignRoles(players);
      setAssignments(newAssignments);
      setGamePhase('playing');
    }
  }, [players]);

  const reroll = useCallback(() => {
    if (players.length >= 5) {
      const newAssignments = assignRoles(players);
      setAssignments(newAssignments);
    }
  }, [players]);

  const reset = useCallback(() => {
    setAssignments(null);
    setGamePhase('setup');
  }, []);

  const clearAll = useCallback(() => {
    setPlayers([]);
    setAssignments(null);
    setGamePhase('setup');
  }, []);

  // Get distribution preview
  const getDistributionPreview = useCallback(() => {
    if (players.length < 5) return null;
    return getRoleDistribution(players.length);
  }, [players.length]);

  return {
    players,
    assignments,
    gamePhase,
    addPlayer,
    removePlayer,
    startGame,
    reroll,
    reset,
    clearAll,
    getDistributionPreview,
    canStart: players.length >= 5,
  };
}

