import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Skull, Shield, Search, Ghost, Target, Users } from 'lucide-react';

const roles = [
  {
    id: 'villager',
    name: 'Villager',
    faction: 'town',
    icon: Users,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Regular townsperson',
    description: 'The Villager is an ordinary member of the Town with no special abilities. Your goal is to identify and eliminate all Mafia members through discussion and voting during the day phase.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'doctor',
    name: 'Doctor',
    faction: 'town',
    icon: Shield,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Heals one player each night',
    description: 'The Doctor is a powerful Town role that can protect one player from being killed each night. Choose wisely—a well-timed heal can save a crucial Town member from the Mafia.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'investigator',
    name: 'Investigator',
    faction: 'town',
    icon: Search,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Checks one player each night',
    description: 'The Investigator can check one player each night to learn if they are "Good" or "Not Good". Town roles (Villager, Doctor, Investigator) show as Good. Mafia and Neutral roles (Mafioso, Jester, Executioner) show as Not Good.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'mafioso',
    name: 'Mafioso',
    faction: 'mafia',
    icon: Skull,
    color: 'text-blood',
    bgColor: 'bg-blood/10',
    borderColor: 'border-blood/30',
    shortDesc: 'Kills for the Mafia',
    description: 'The Mafioso is a member of the Mafia family. Each night, the Mafia chooses one player to eliminate. You know who your fellow Mafia members are and must work together to avoid detection.',
    winCondition: 'Equal or outnumber the Town (and eliminate threats).',
    investigatorResult: 'Not Good',
  },
  {
    id: 'jester',
    name: 'Jester',
    faction: 'neutral',
    icon: Ghost,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    shortDesc: 'Wants to be lynched',
    description: 'The Jester is a chaotic Neutral role whose sole goal is to get lynched by the Town. You must act suspicious enough to get voted out, but not so obvious that players realize you\'re the Jester.',
    winCondition: 'Get yourself lynched by the Town during the day.',
    investigatorResult: 'Not Good',
  },
  {
    id: 'executioner',
    name: 'Executioner',
    faction: 'neutral',
    icon: Target,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    shortDesc: 'Must get target lynched',
    description: 'The Executioner is assigned a specific Town member as their target. Your goal is to get your target lynched by the Town—through manipulation, false accusations, or strategic voting.',
    winCondition: 'Get your assigned target lynched by the Town.',
    investigatorResult: 'Not Good',
  },
];

function RoleCard({ role, onClick }) {
  const Icon = role.icon;
  
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass rounded-xl p-4 border ${role.borderColor} text-left
                hover:shadow-lg transition-all duration-300 w-full h-full flex flex-col`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg ${role.bgColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${role.color}`} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{role.name}</h3>
          <p className="text-xs text-neutral-500 capitalize">{role.faction}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-400 flex-1">{role.shortDesc}</p>
    </motion.button>
  );
}

function RoleDetail({ role, onBack }) {
  const Icon = role.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      {/* Header */}
      <div className={`glass rounded-2xl p-6 mb-4 border ${role.borderColor}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl ${role.bgColor} flex items-center justify-center`}>
            <Icon className={`w-7 h-7 ${role.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{role.name}</h2>
            <p className="text-sm text-neutral-500 capitalize">{role.faction} Faction</p>
          </div>
        </div>
        <p className="text-neutral-300 leading-relaxed">{role.description}</p>
      </div>

      {/* Win Condition */}
      <div className="glass-darker rounded-xl p-4 mb-4">
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Win Condition</h3>
        <p className={`text-sm ${role.color}`}>{role.winCondition}</p>
      </div>

      {/* Investigator Result */}
      <div className="glass-darker rounded-xl p-4">
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Investigator Result</h3>
        <p className={`text-sm ${role.investigatorResult === 'Good' ? 'text-town' : 'text-blood'}`}>
          {role.investigatorResult}
        </p>
      </div>
    </motion.div>
  );
}

export function RoleGuide({ onBack }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const townRoles = roles.filter(r => r.faction === 'town');
  const mafiaRoles = roles.filter(r => r.faction === 'mafia');
  const neutralRoles = roles.filter(r => r.faction === 'neutral');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto px-4 pb-8"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={selectedRole ? () => setSelectedRole(null) : onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 mt-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">{selectedRole ? 'All Roles' : 'Back'}</span>
      </motion.button>

      <AnimatePresence mode="wait">
        {selectedRole ? (
          <RoleDetail 
            key="detail" 
            role={selectedRole} 
            onBack={() => setSelectedRole(null)} 
          />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 
                className="text-4xl font-display tracking-wider text-white mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ROLE GUIDE
              </h1>
              <p className="text-neutral-400 text-sm">
                Tap a role to learn more
              </p>
            </motion.div>

            {/* Town Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-town"></div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-500">Town</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {townRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <RoleCard role={role} onClick={() => setSelectedRole(role)} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mafia Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blood"></div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-500">Mafia</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {mafiaRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (townRoles.length + index) * 0.05 }}
                    className="h-full"
                  >
                    <RoleCard role={role} onClick={() => setSelectedRole(role)} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Neutral Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-neutral"></div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-500">Neutral</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {neutralRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (townRoles.length + mafiaRoles.length + index) * 0.05 }}
                    className="h-full"
                  >
                    <RoleCard role={role} onClick={() => setSelectedRole(role)} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

