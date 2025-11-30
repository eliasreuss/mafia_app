import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Play, Users, Skull, Ghost, Shield, Search, Target, Eye, UserX, Flame, Sparkles, Crosshair, AlertTriangle, Heart } from 'lucide-react';
import { ALL_ROLES } from '../hooks/useGameLogic';

const roleIcons = {
  villager: Users,
  doctor: Shield,
  investigator: Search,
  bodyguard: Crosshair,
  lookout: Eye,
  escort: UserX,
  mayor: Sparkles,
  veteran: AlertTriangle,
  mafioso: Skull,
  godfather: Skull,
  consort: UserX,
  framer: Target,
  janitor: Ghost,
  jester: Ghost,
  executioner: Target,
  serial_killer: Crosshair,
  survivor: Heart,
  witch: Sparkles,
  arsonist: Flame,
};

const factionConfig = {
  town: {
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    label: 'Town',
  },
  mafia: {
    color: 'text-blood',
    bgColor: 'bg-blood/10',
    borderColor: 'border-blood/30',
    label: 'Mafia',
  },
  neutral: {
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    label: 'Neutral',
  },
};

function RoleSelector({ role, count, onIncrement, onDecrement, maxReached }) {
  const Icon = roleIcons[role.id] || Users;
  const config = factionConfig[role.faction];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-3 border ${config.borderColor} ${count > 0 ? 'ring-1 ring-white/20' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{role.name}</h4>
            <p className="text-xs text-neutral-500 truncate">{role.ability || 'No ability'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDecrement}
            disabled={count === 0}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                      ${count === 0 ? 'bg-noir-800 text-neutral-600 cursor-not-allowed' : 'bg-noir-700 text-white hover:bg-noir-600'}`}
          >
            <Minus className="w-3.5 h-3.5" />
          </motion.button>
          
          <span className={`w-6 text-center text-sm font-semibold ${count > 0 ? 'text-white' : 'text-neutral-600'}`}>
            {count}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onIncrement}
            disabled={maxReached}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                      ${maxReached ? 'bg-noir-800 text-neutral-600 cursor-not-allowed' : 'bg-noir-700 text-white hover:bg-noir-600'}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function CustomSetup({ playerCount, onStartGame, onBack }) {
  const [roleCounts, setRoleCounts] = useState({});
  
  const totalSelected = useMemo(() => {
    return Object.values(roleCounts).reduce((sum, count) => sum + count, 0);
  }, [roleCounts]);
  
  const remaining = playerCount - totalSelected;
  const canStart = remaining === 0;
  
  const handleIncrement = (roleId) => {
    if (remaining > 0) {
      setRoleCounts(prev => ({
        ...prev,
        [roleId]: (prev[roleId] || 0) + 1
      }));
    }
  };
  
  const handleDecrement = (roleId) => {
    if (roleCounts[roleId] > 0) {
      setRoleCounts(prev => ({
        ...prev,
        [roleId]: prev[roleId] - 1
      }));
    }
  };
  
  const handleStart = () => {
    const selectedRoles = Object.entries(roleCounts)
      .filter(([_, count]) => count > 0)
      .map(([roleId, count]) => ({
        role: ALL_ROLES.find(r => r.id === roleId),
        count
      }));
    onStartGame(selectedRoles);
  };
  
  const townRoles = ALL_ROLES.filter(r => r.faction === 'town');
  const mafiaRoles = ALL_ROLES.filter(r => r.faction === 'mafia');
  const neutralRoles = ALL_ROLES.filter(r => r.faction === 'neutral');
  
  // Count by faction
  const townCount = townRoles.reduce((sum, r) => sum + (roleCounts[r.id] || 0), 0);
  const mafiaCount = mafiaRoles.reduce((sum, r) => sum + (roleCounts[r.id] || 0), 0);
  const neutralCount = neutralRoles.reduce((sum, r) => sum + (roleCounts[r.id] || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto px-4 pb-32"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 mt-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to players</span>
      </motion.button>

      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 
          className="text-4xl font-display tracking-wider text-white mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          CUSTOM GAME
        </h1>
        <p className="text-neutral-400 text-sm">
          Select roles for {playerCount} players
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-darker rounded-xl p-4 mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-500 uppercase tracking-wider">Roles Selected</span>
          <span className={`text-sm font-semibold ${canStart ? 'text-town' : 'text-white'}`}>
            {totalSelected} / {playerCount}
          </span>
        </div>
        <div className="h-2 bg-noir-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalSelected / playerCount) * 100}%` }}
            className={`h-full rounded-full transition-colors ${canStart ? 'bg-town' : 'bg-blood'}`}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-town">Town: {townCount}</span>
          <span className="text-blood">Mafia: {mafiaCount}</span>
          <span className="text-neutral">Neutral: {neutralCount}</span>
        </div>
      </motion.div>

      {/* Town Roles */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-town"></div>
          <h3 className="text-xs uppercase tracking-wider text-neutral-500">Town Roles</h3>
        </div>
        <div className="space-y-2">
          {townRoles.map((role, index) => (
            <RoleSelector
              key={role.id}
              role={role}
              count={roleCounts[role.id] || 0}
              onIncrement={() => handleIncrement(role.id)}
              onDecrement={() => handleDecrement(role.id)}
              maxReached={remaining === 0}
            />
          ))}
        </div>
      </div>

      {/* Mafia Roles */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-blood"></div>
          <h3 className="text-xs uppercase tracking-wider text-neutral-500">Mafia Roles</h3>
        </div>
        <div className="space-y-2">
          {mafiaRoles.map((role, index) => (
            <RoleSelector
              key={role.id}
              role={role}
              count={roleCounts[role.id] || 0}
              onIncrement={() => handleIncrement(role.id)}
              onDecrement={() => handleDecrement(role.id)}
              maxReached={remaining === 0}
            />
          ))}
        </div>
      </div>

      {/* Neutral Roles */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-neutral"></div>
          <h3 className="text-xs uppercase tracking-wider text-neutral-500">Neutral Roles</h3>
        </div>
        <div className="space-y-2">
          {neutralRoles.map((role, index) => (
            <RoleSelector
              key={role.id}
              role={role}
              count={roleCounts[role.id] || 0}
              onIncrement={() => handleIncrement(role.id)}
              onDecrement={() => handleDecrement(role.id)}
              maxReached={remaining === 0}
            />
          ))}
        </div>
      </div>

      {/* Start Button - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-noir-950 via-noir-950/95 to-transparent"
      >
        <div className="max-w-md mx-auto">
          <motion.button
            whileHover={canStart ? { scale: 1.02, y: -2 } : {}}
            whileTap={canStart ? { scale: 0.98 } : {}}
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3
                      transition-all duration-300 ${
                        canStart
                          ? 'bg-gradient-to-r from-blood via-red-600 to-blood-dark text-white shadow-xl shadow-blood/30 hover:shadow-blood/50'
                          : 'bg-noir-800 text-neutral-600 cursor-not-allowed'
                      }`}
          >
            <Play className={`w-5 h-5 ${canStart ? 'animate-pulse' : ''}`} />
            {canStart ? 'Start Game' : `Select ${remaining} more role${remaining !== 1 ? 's' : ''}`}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

