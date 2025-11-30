import { motion } from 'framer-motion';
import { Crown, Users } from 'lucide-react';

export function LandingPage({ onSelectGameMaster, onSelectPlayer }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto px-4 min-h-screen flex flex-col justify-center"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 
          className="text-6xl font-display tracking-wider text-white mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          MAFIA
        </h1>
        <p className="text-neutral-400 text-sm tracking-widest uppercase">
          Town of Salem Companion
        </p>
      </motion.div>

      {/* Question */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-neutral-300 text-lg mb-8"
      >
        What are you playing as?
      </motion.p>

      {/* Buttons */}
      <div className="space-y-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectGameMaster}
          className="w-full py-5 px-6 rounded-2xl glass border border-blood/30
                   flex items-center justify-center gap-4 group
                   hover:border-blood/50 hover:shadow-lg hover:shadow-blood/20 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-blood/20 flex items-center justify-center
                        group-hover:bg-blood/30 transition-colors">
            <Crown className="w-6 h-6 text-blood" />
          </div>
          <div className="text-left flex-1">
            <h2 className="text-white font-semibold text-lg">Game Master</h2>
            <p className="text-neutral-500 text-sm">Assign roles & manage the game</p>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectPlayer}
          className="w-full py-5 px-6 rounded-2xl glass border border-town/30
                   flex items-center justify-center gap-4 group
                   hover:border-town/50 hover:shadow-lg hover:shadow-town/20 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-town/20 flex items-center justify-center
                        group-hover:bg-town/30 transition-colors">
            <Users className="w-6 h-6 text-town" />
          </div>
          <div className="text-left flex-1">
            <h2 className="text-white font-semibold text-lg">Player</h2>
            <p className="text-neutral-500 text-sm">Learn about roles & abilities</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

