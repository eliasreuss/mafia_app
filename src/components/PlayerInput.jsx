import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Users, Play, Skull, Shield, Search, Ghost, Target, ArrowLeft, Settings } from 'lucide-react';

const roleIcons = {
  mafia: <Skull className="w-3.5 h-3.5" />,
  doctor: <Shield className="w-3.5 h-3.5" />,
  investigator: <Search className="w-3.5 h-3.5" />,
  jester: <Ghost className="w-3.5 h-3.5" />,
  executioner: <Target className="w-3.5 h-3.5" />,
  villagers: <Users className="w-3.5 h-3.5" />,
};

export function PlayerInput({ 
  players, 
  onAddPlayer, 
  onRemovePlayer, 
  onStartStandard,
  onStartCustom,
  canStartStandard,
  canStartCustom,
  distributionPreview,
  onBack 
}) {
  const [inputValue, setInputValue] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onAddPlayer(inputValue);
    if (success) {
      setInputValue('');
    } else if (inputValue.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </motion.button>

      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 
          className="text-5xl font-display tracking-wider text-white mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          MAFIA
        </h1>
        <p className="text-neutral-400 text-sm tracking-widest uppercase">
          Game Master Companion
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-neutral-400" />
          <span className="text-neutral-300 font-medium">Add Players</span>
          <span className="ml-auto text-sm text-neutral-500">
            {players.length} player{players.length !== 1 ? 's' : ''}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <motion.div 
            className="flex-1 relative"
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter player name..."
              className="w-full bg-noir-900/80 border border-neutral-700/50 rounded-xl px-4 py-3 
                       text-white placeholder-neutral-500 transition-all duration-200
                       focus:border-blood/50 focus:ring-2 focus:ring-blood/20"
              autoComplete="off"
            />
          </motion.div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blood to-blood-dark text-white rounded-xl px-4 
                     flex items-center justify-center shadow-lg shadow-blood/20
                     hover:shadow-blood/30 transition-shadow"
          >
            <UserPlus className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>

      {/* Player List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 mb-6 min-h-[200px]"
      >
        <AnimatePresence mode="popLayout">
          {players.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 text-neutral-500"
            >
              <Users className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No players added yet</p>
              <p className="text-xs text-neutral-600 mt-1">Add at least 3 players for custom, 5 for standard</p>
            </motion.div>
          ) : (
            <motion.div layout className="flex flex-wrap gap-2">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    delay: index * 0.02 
                  }}
                  className="group flex items-center gap-2 bg-noir-700/60 border border-neutral-600/30 
                           rounded-full pl-4 pr-2 py-2 hover:border-neutral-500/50 transition-colors"
                >
                  <span className="text-sm text-neutral-200">{player.name}</span>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(220, 38, 38, 0.3)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemovePlayer(player.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center 
                             text-neutral-500 hover:text-blood transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Distribution Preview (Standard Mode) */}
      <AnimatePresence>
        {distributionPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-darker rounded-2xl p-4 mb-6 overflow-hidden"
          >
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Standard Distribution</p>
            <div className="grid grid-cols-3 gap-2">
              {distributionPreview.mafia > 0 && (
                <div className="flex items-center gap-2 text-blood">
                  {roleIcons.mafia}
                  <span className="text-xs">{distributionPreview.mafia} Mafia</span>
                </div>
              )}
              {distributionPreview.doctor > 0 && (
                <div className="flex items-center gap-2 text-town">
                  {roleIcons.doctor}
                  <span className="text-xs">{distributionPreview.doctor} Doctor</span>
                </div>
              )}
              {distributionPreview.investigator > 0 && (
                <div className="flex items-center gap-2 text-town">
                  {roleIcons.investigator}
                  <span className="text-xs">{distributionPreview.investigator} Invest.</span>
                </div>
              )}
              {distributionPreview.jester > 0 && (
                <div className="flex items-center gap-2 text-neutral">
                  {roleIcons.jester}
                  <span className="text-xs">{distributionPreview.jester} Jester</span>
                </div>
              )}
              {distributionPreview.executioner > 0 && (
                <div className="flex items-center gap-2 text-neutral">
                  {roleIcons.executioner}
                  <span className="text-xs">{distributionPreview.executioner} Exec.</span>
                </div>
              )}
              {distributionPreview.villagers > 0 && (
                <div className="flex items-center gap-2 text-town">
                  {roleIcons.villagers}
                  <span className="text-xs">{distributionPreview.villagers} Villager{distributionPreview.villagers > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Mode Buttons */}
      <div className="space-y-3">
        {/* Standard Game Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={canStartStandard ? { scale: 1.02, y: -2 } : {}}
          whileTap={canStartStandard ? { scale: 0.98 } : {}}
          onClick={onStartStandard}
          disabled={!canStartStandard}
          className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3
                    transition-all duration-300 ${
                      canStartStandard
                        ? 'bg-gradient-to-r from-blood via-red-600 to-blood-dark text-white shadow-xl shadow-blood/30 hover:shadow-blood/50'
                        : 'bg-noir-800 text-neutral-600 cursor-not-allowed'
                    }`}
        >
          <Play className={`w-5 h-5 ${canStartStandard ? 'animate-pulse' : ''}`} />
          {canStartStandard ? 'Standard Game' : `Need ${5 - players.length} more for standard`}
        </motion.button>

        {/* Custom Game Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={canStartCustom ? { scale: 1.02, y: -2 } : {}}
          whileTap={canStartCustom ? { scale: 0.98 } : {}}
          onClick={onStartCustom}
          disabled={!canStartCustom}
          className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3
                    transition-all duration-300 border ${
                      canStartCustom
                        ? 'bg-noir-800/50 border-neutral/50 text-neutral-200 hover:bg-noir-700/50 hover:border-neutral'
                        : 'bg-noir-800 border-noir-700 text-neutral-600 cursor-not-allowed'
                    }`}
        >
          <Settings className={`w-5 h-5`} />
          {canStartCustom ? 'Custom Game' : `Need ${3 - players.length} more for custom`}
        </motion.button>
      </div>
    </motion.div>
  );
}
