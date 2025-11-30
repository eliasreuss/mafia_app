import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { PlayerInput } from './components/PlayerInput';
import { CustomSetup } from './components/CustomSetup';
import { GameDashboard } from './components/GameDashboard';
import { RoleGuide } from './components/RoleGuide';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const [appMode, setAppMode] = useState('landing'); // 'landing', 'gm', 'player'
  
  const {
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
    getDistributionPreview,
    canStartStandard,
    canStartCustom,
  } = useGameLogic();

  const handleSelectGameMaster = () => {
    setAppMode('gm');
  };

  const handleSelectPlayer = () => {
    setAppMode('player');
  };

  const handleBackToLanding = () => {
    setAppMode('landing');
    reset();
  };

  return (
    <div className="min-h-screen bg-pattern noise">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blood/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neutral/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-12 pb-8">
        <AnimatePresence mode="wait">
          {appMode === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage
                onSelectGameMaster={handleSelectGameMaster}
                onSelectPlayer={handleSelectPlayer}
              />
            </motion.div>
          )}

          {appMode === 'player' && (
            <motion.div
              key="player"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RoleGuide onBack={handleBackToLanding} />
            </motion.div>
          )}

          {appMode === 'gm' && gamePhase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PlayerInput
                players={players}
                onAddPlayer={addPlayer}
                onRemovePlayer={removePlayer}
                onStartStandard={startStandardGame}
                onStartCustom={goToCustomSetup}
                canStartStandard={canStartStandard}
                canStartCustom={canStartCustom}
                distributionPreview={getDistributionPreview()}
                onBack={handleBackToLanding}
              />
            </motion.div>
          )}

          {appMode === 'gm' && gamePhase === 'custom-setup' && (
            <motion.div
              key="custom-setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CustomSetup
                playerCount={players.length}
                onStartGame={startCustomGame}
                onBack={backToPlayerInput}
              />
            </motion.div>
          )}

          {appMode === 'gm' && gamePhase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GameDashboard
                assignments={assignments}
                onReroll={reroll}
                onReset={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
