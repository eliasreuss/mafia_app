import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, RotateCcw, Skull, Shield, Search, Ghost, Target, Users } from 'lucide-react';

const roleConfig = {
  Villager: {
    icon: Users,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    glowClass: 'hover:shadow-town/20',
  },
  Doctor: {
    icon: Shield,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    glowClass: 'hover:shadow-town/20',
  },
  Investigator: {
    icon: Search,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    glowClass: 'hover:shadow-town/20',
  },
  Mafioso: {
    icon: Skull,
    color: 'text-blood',
    bgColor: 'bg-blood/10',
    borderColor: 'border-blood/30',
    glowClass: 'hover:shadow-blood/20',
  },
  Jester: {
    icon: Ghost,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    glowClass: 'hover:shadow-neutral/20',
  },
  Executioner: {
    icon: Target,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    glowClass: 'hover:shadow-neutral/20',
  },
};

function PlayerCard({ assignment, index }) {
  const config = roleConfig[assignment.role.name] || roleConfig.Villager;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        delay: index * 0.05 
      }}
      className={`glass rounded-xl p-4 border ${config.borderColor} ${config.glowClass}
                hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-white text-lg">{assignment.name}</h3>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor} ${config.color}`}>
            <Icon className="w-4 h-4" />
            <span className="font-medium text-sm">{assignment.role.name}</span>
          </div>
          
          {assignment.target && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-neutral-400 mt-2 flex items-center gap-1.5"
            >
              <Target className="w-3 h-3 text-neutral" />
              Target: <span className="text-neutral font-medium">{assignment.target.name}</span>
            </motion.p>
          )}
          
          {assignment.role.ability && (
            <p className="text-xs text-neutral-500 mt-1">
              Ability: {assignment.role.ability}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function GameDashboard({ assignments, onReroll, onReset }) {
  // Count roles
  const roleCounts = assignments.reduce((acc, a) => {
    const faction = a.role.faction;
    acc[faction] = (acc[faction] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto px-4 pb-24"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 
          className="text-4xl font-display tracking-wider text-white mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          GAME MASTER
        </h1>
        <p className="text-neutral-400 text-sm">
          {assignments.length} players • Night falls soon...
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-darker rounded-xl p-3 mb-4 flex items-center justify-center gap-6"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-town"></div>
          <span className="text-xs text-neutral-400">Town: {roleCounts.town || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blood"></div>
          <span className="text-xs text-neutral-400">Mafia: {roleCounts.mafia || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-neutral"></div>
          <span className="text-xs text-neutral-400">Neutral: {roleCounts.neutral || 0}</span>
        </div>
      </motion.div>

      {/* Player Cards */}
      <motion.div 
        layout
        className="space-y-3"
      >
        <AnimatePresence>
          {assignments.map((assignment, index) => (
            <PlayerCard
              key={assignment.id}
              assignment={assignment}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Action Buttons - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-noir-950 via-noir-950/95 to-transparent"
      >
        <div className="max-w-md mx-auto flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReroll}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 
                     text-white font-semibold flex items-center justify-center gap-2
                     shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-shadow"
          >
            <RefreshCw className="w-4 h-4" />
            Re-roll
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex-1 py-3 px-4 rounded-xl bg-noir-700 border border-neutral-600/50
                     text-neutral-300 font-semibold flex items-center justify-center gap-2
                     hover:bg-noir-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
