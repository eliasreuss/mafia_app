import { useState, useCallback } from 'react';

// Role definitions with metadata
export const ROLES = {
  // Town roles
  VILLAGER: {
    id: 'villager',
    name: 'Villager',
    faction: 'town',
    description: 'A regular townsperson with no special abilities.',
    ability: null,
    investigatorResult: 'Good',
  },
  DOCTOR: {
    id: 'doctor',
    name: 'Doctor',
    faction: 'town',
    description: 'Can protect one player from death each night.',
    ability: 'Heal',
    investigatorResult: 'Good',
  },
  INVESTIGATOR: {
    id: 'investigator',
    name: 'Investigator',
    faction: 'town',
    description: 'Checks if a player is "Good" or "Not Good" each night.',
    ability: 'Investigate',
    investigatorResult: 'Good',
  },
  BODYGUARD: {
    id: 'bodyguard',
    name: 'Bodyguard',
    faction: 'town',
    description: 'Protects a player at night. If they are attacked, both the attacker and Bodyguard die.',
    ability: 'Protect',
    investigatorResult: 'Good',
  },
  ESCORT: {
    id: 'escort',
    name: 'Escort',
    faction: 'town',
    description: 'Roleblocks a player each night, preventing them from using their ability.',
    ability: 'Roleblock',
    investigatorResult: 'Good',
  },
  MAYOR: {
    id: 'mayor',
    name: 'Mayor',
    faction: 'town',
    description: 'Can reveal themselves during the day. Once revealed, their vote counts as 3 votes.',
    ability: 'Reveal',
    investigatorResult: 'Good',
  },
  VETERAN: {
    id: 'veteran',
    name: 'Veteran',
    faction: 'town',
    description: 'Can go on alert at night. Anyone who visits the Veteran while on alert will die. Limited uses.',
    ability: 'Alert',
    investigatorResult: 'Good',
  },
  
  // Mafia roles
  MAFIOSO: {
    id: 'mafioso',
    name: 'Mafioso',
    faction: 'mafia',
    description: 'Works with other Mafia to eliminate the Town each night.',
    ability: 'Kill',
    investigatorResult: 'Not Good',
  },
  GODFATHER: {
    id: 'godfather',
    name: 'Godfather',
    faction: 'mafia',
    description: 'The leader of the Mafia. Appears as "Good" to Investigators.',
    ability: 'Kill',
    investigatorResult: 'Good',
  },
  CONSORT: {
    id: 'consort',
    name: 'Consort',
    faction: 'mafia',
    description: 'Roleblocks a player each night, preventing them from using their ability.',
    ability: 'Roleblock',
    investigatorResult: 'Not Good',
  },
  FRAMER: {
    id: 'framer',
    name: 'Framer',
    faction: 'mafia',
    description: 'Frames a player each night, making them appear as "Not Good" to Investigators.',
    ability: 'Frame',
    investigatorResult: 'Not Good',
  },
  JANITOR: {
    id: 'janitor',
    name: 'Janitor',
    faction: 'mafia',
    description: 'Cleans the Mafia\'s kill, hiding the victim\'s role from the Town.',
    ability: 'Clean',
    investigatorResult: 'Not Good',
  },
  
  // Neutral roles
  JESTER: {
    id: 'jester',
    name: 'Jester',
    faction: 'neutral',
    description: 'Wins by getting lynched by the Town during the day.',
    ability: null,
    investigatorResult: 'Not Good',
  },
  EXECUTIONER: {
    id: 'executioner',
    name: 'Executioner',
    faction: 'neutral',
    description: 'Wins by getting their assigned Town target lynched.',
    ability: null,
    hasTarget: true,
    investigatorResult: 'Not Good',
  },
  SERIAL_KILLER: {
    id: 'serial_killer',
    name: 'Serial Killer',
    faction: 'neutral',
    description: 'Kills one player each night. Wins by being the last one standing.',
    ability: 'Kill',
    investigatorResult: 'Not Good',
  },
  SURVIVOR: {
    id: 'survivor',
    name: 'Survivor',
    faction: 'neutral',
    description: 'Has limited bulletproof vests. Wins by simply surviving until the end.',
    ability: 'Vest',
    investigatorResult: 'Good',
  },
  ARSONIST: {
    id: 'arsonist',
    name: 'Arsonist',
    faction: 'neutral',
    description: 'Douses players in gasoline each night. Can ignite to kill all doused players at once.',
    ability: 'Douse/Ignite',
    investigatorResult: 'Not Good',
  },
};

// Get all roles as array for custom game
export const ALL_ROLES = Object.values(ROLES);

// Get role distribution based on player count (Standard mode)
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
    distribution.mafia = 1;
    distribution.doctor = 1;
    distribution.villagers = playerCount - 2;
  } else if (playerCount >= 7 && playerCount <= 8) {
    distribution.mafia = 2;
    distribution.doctor = 1;
    distribution.investigator = 1;
    distribution.jester = 1;
    distribution.villagers = playerCount - 5;
  } else if (playerCount === 9) {
    distribution.mafia = 3;
    distribution.doctor = 1;
    distribution.investigator = 1;
    distribution.jester = 1;
    distribution.villagers = playerCount - 6;
  } else if (playerCount >= 10) {
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

// Assign roles to players (Standard mode)
function assignRoles(players) {
  const playerCount = players.length;
  const distribution = getRoleDistribution(playerCount);
  
  const rolePool = [];
  
  for (let i = 0; i < distribution.mafia; i++) {
    rolePool.push({ ...ROLES.MAFIOSO });
  }
  for (let i = 0; i < distribution.doctor; i++) {
    rolePool.push({ ...ROLES.DOCTOR });
  }
  for (let i = 0; i < distribution.investigator; i++) {
    rolePool.push({ ...ROLES.INVESTIGATOR });
  }
  for (let i = 0; i < distribution.jester; i++) {
    rolePool.push({ ...ROLES.JESTER });
  }
  for (let i = 0; i < distribution.executioner; i++) {
    rolePool.push({ ...ROLES.EXECUTIONER });
  }
  for (let i = 0; i < distribution.villagers; i++) {
    rolePool.push({ ...ROLES.VILLAGER });
  }
  
  const shuffledPlayers = shuffleArray(players);
  const shuffledRoles = shuffleArray(rolePool);
  
  const assignments = shuffledPlayers.map((player, index) => ({
    id: player.id,
    name: player.name,
    role: shuffledRoles[index],
    target: null,
  }));
  
  // Handle Executioner target assignment
  const executioner = assignments.find(a => a.role.name === 'Executioner');
  if (executioner) {
    const townPlayers = assignments.filter(
      a => a.role.faction === 'town' && a.id !== executioner.id
    );
    
    if (townPlayers.length > 0) {
      const randomTarget = townPlayers[Math.floor(Math.random() * townPlayers.length)];
      executioner.target = {
        id: randomTarget.id,
        name: randomTarget.name,
      };
    }
  }
  
  return assignments.sort((a, b) => a.name.localeCompare(b.name));
}

// Assign custom roles to players
function assignCustomRoles(players, selectedRoles) {
  // Build role pool from selected roles
  const rolePool = [];
  
  selectedRoles.forEach(({ role, count }) => {
    for (let i = 0; i < count; i++) {
      rolePool.push({ ...role });
    }
  });
  
  const shuffledPlayers = shuffleArray(players);
  const shuffledRoles = shuffleArray(rolePool);
  
  const assignments = shuffledPlayers.map((player, index) => ({
    id: player.id,
    name: player.name,
    role: shuffledRoles[index],
    target: null,
  }));
  
  // Handle Executioner target assignment
  const executioners = assignments.filter(a => a.role.name === 'Executioner');
  executioners.forEach(executioner => {
    const townPlayers = assignments.filter(
      a => a.role.faction === 'town' && 
           a.id !== executioner.id &&
           !executioners.some(e => e.target?.id === a.id) // Not already someone's target
    );
    
    if (townPlayers.length > 0) {
      const randomTarget = townPlayers[Math.floor(Math.random() * townPlayers.length)];
      executioner.target = {
        id: randomTarget.id,
        name: randomTarget.name,
      };
    }
  });
  
  return assignments.sort((a, b) => a.name.localeCompare(b.name));
}

// Custom hook for game logic
export function useGameLogic() {
  const [players, setPlayers] = useState([]);
  const [assignments, setAssignments] = useState(null);
  const [gamePhase, setGamePhase] = useState('setup'); // 'setup', 'custom-setup', 'playing'
  const [gameMode, setGameMode] = useState('standard'); // 'standard' or 'custom'
  const [customRoles, setCustomRoles] = useState([]); // [{role, count}]

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

  const startStandardGame = useCallback(() => {
    if (players.length >= 5) {
      const newAssignments = assignRoles(players);
      setAssignments(newAssignments);
      setGameMode('standard');
      setGamePhase('playing');
    }
  }, [players]);

  const goToCustomSetup = useCallback(() => {
    if (players.length >= 3) {
      setGameMode('custom');
      setGamePhase('custom-setup');
    }
  }, [players]);

  const startCustomGame = useCallback((selectedRoles) => {
    const totalRoles = selectedRoles.reduce((sum, r) => sum + r.count, 0);
    if (totalRoles === players.length) {
      setCustomRoles(selectedRoles);
      const newAssignments = assignCustomRoles(players, selectedRoles);
      setAssignments(newAssignments);
      setGamePhase('playing');
    }
  }, [players]);

  const reroll = useCallback(() => {
    if (gameMode === 'standard' && players.length >= 5) {
      const newAssignments = assignRoles(players);
      setAssignments(newAssignments);
    } else if (gameMode === 'custom' && customRoles.length > 0) {
      const newAssignments = assignCustomRoles(players, customRoles);
      setAssignments(newAssignments);
    }
  }, [players, gameMode, customRoles]);

  const reset = useCallback(() => {
    setAssignments(null);
    setGamePhase('setup');
    setGameMode('standard');
    setCustomRoles([]);
  }, []);

  const backToPlayerInput = useCallback(() => {
    setGamePhase('setup');
    setCustomRoles([]);
  }, []);

  const clearAll = useCallback(() => {
    setPlayers([]);
    setAssignments(null);
    setGamePhase('setup');
    setGameMode('standard');
    setCustomRoles([]);
  }, []);

  const getDistributionPreview = useCallback(() => {
    if (players.length < 5) return null;
    return getRoleDistribution(players.length);
  }, [players.length]);

  return {
    players,
    assignments,
    gamePhase,
    gameMode,
    addPlayer,
    removePlayer,
    startStandardGame,
    goToCustomSetup,
    startCustomGame,
    reroll,
    reset,
    backToPlayerInput,
    clearAll,
    getDistributionPreview,
    canStartStandard: players.length >= 5,
    canStartCustom: players.length >= 3,
  };
}
