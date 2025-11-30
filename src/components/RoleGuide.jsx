import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Skull, Shield, Search, Ghost, Target, Users, Eye, UserX, Flame, Sparkles, Crosshair, AlertTriangle, Heart } from 'lucide-react';

const roles = [
  // Town roles
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
    description: 'The Investigator can check one player each night to learn if they are "Good" or "Not Good". Town roles show as Good. Mafia and most Neutral roles show as Not Good. Note: Godfather and Survivor appear as Good.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'bodyguard',
    name: 'Bodyguard',
    faction: 'town',
    icon: Crosshair,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Protects at cost of life',
    description: 'The Bodyguard protects a player at night. If that player is attacked, the Bodyguard will kill the attacker but also die in the process. A noble sacrifice for the Town.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'lookout',
    name: 'Lookout',
    faction: 'town',
    icon: Eye,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Watches who visits a player',
    description: 'The Lookout watches a player at night and sees everyone who visits them. This can help identify the Mafia or confirm other Town roles.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'escort',
    name: 'Escort',
    faction: 'town',
    icon: UserX,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Roleblocks a player',
    description: 'The Escort roleblocks a player each night, preventing them from using their ability. Can stop a Mafia kill if you block the right person.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'mayor',
    name: 'Mayor',
    faction: 'town',
    icon: Sparkles,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Vote counts as 3',
    description: 'The Mayor can reveal themselves during the day. Once revealed, their vote counts as 3 votes. However, the Doctor cannot heal a revealed Mayor.',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    faction: 'town',
    icon: AlertTriangle,
    color: 'text-town',
    bgColor: 'bg-town/10',
    borderColor: 'border-town/30',
    shortDesc: 'Kills all visitors on alert',
    description: 'The Veteran can go on alert at night (limited uses). Anyone who visits the Veteran while on alert will be killed—including Town members. Use carefully!',
    winCondition: 'Eliminate all Mafia members and hostile Neutrals.',
    investigatorResult: 'Good',
  },
  
  // Mafia roles
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
    id: 'godfather',
    name: 'Godfather',
    faction: 'mafia',
    icon: Skull,
    color: 'text-blood',
    bgColor: 'bg-blood/10',
    borderColor: 'border-blood/30',
    shortDesc: 'Appears innocent to Invest.',
    description: 'The Godfather is the leader of the Mafia. They appear as "Good" to Investigators, making them harder to detect. They can also perform the Mafia kill.',
    winCondition: 'Equal or outnumber the Town (and eliminate threats).',
    investigatorResult: 'Good',
  },
  {
    id: 'consort',
    name: 'Consort',
    faction: 'mafia',
    icon: UserX,
    color: 'text-blood',
    bgColor: 'bg-blood/10',
    borderColor: 'border-blood/30',
    shortDesc: 'Mafia roleblock',
    description: 'The Consort is the Mafia\'s roleblock. They can prevent a player from using their ability each night—perfect for stopping Investigators or Doctors.',
    winCondition: 'Equal or outnumber the Town (and eliminate threats).',
    investigatorResult: 'Not Good',
  },
  {
    id: 'framer',
    name: 'Framer',
    faction: 'mafia',
    icon: Target,
    color: 'text-blood',
    bgColor: 'bg-blood/10',
    borderColor: 'border-blood/30',
    shortDesc: 'Makes target appear evil',
    description: 'The Framer frames a player each night, making them appear as "Not Good" to Investigators. Great for getting innocent Town members lynched.',
    winCondition: 'Equal or outnumber the Town (and eliminate threats).',
    investigatorResult: 'Not Good',
  },
  {
    id: 'janitor',
    name: 'Janitor',
    faction: 'mafia',
    icon: Ghost,
    color: 'text-blood',
    bgColor: 'bg-blood/10',
    borderColor: 'border-blood/30',
    shortDesc: 'Hides victim\'s role',
    description: 'The Janitor can clean the Mafia\'s kill, hiding the victim\'s role from the Town. Only the Janitor learns the cleaned role.',
    winCondition: 'Equal or outnumber the Town (and eliminate threats).',
    investigatorResult: 'Not Good',
  },
  
  // Neutral roles
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
  {
    id: 'serial_killer',
    name: 'Serial Killer',
    faction: 'neutral',
    icon: Crosshair,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    shortDesc: 'Kills independently',
    description: 'The Serial Killer is a lone wolf who kills one player each night, independent of the Mafia. If roleblocked, the Serial Killer kills the roleblocker instead.',
    winCondition: 'Be the last player standing.',
    investigatorResult: 'Not Good',
  },
  {
    id: 'survivor',
    name: 'Survivor',
    faction: 'neutral',
    icon: Heart,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    shortDesc: 'Just wants to live',
    description: 'The Survivor has limited bulletproof vests that can protect them at night. They have no allegiance—their only goal is to survive until the end of the game.',
    winCondition: 'Survive until the end of the game.',
    investigatorResult: 'Good',
  },
  {
    id: 'witch',
    name: 'Witch',
    faction: 'neutral',
    icon: Sparkles,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    shortDesc: 'Controls other players',
    description: 'The Witch can control a player each night, choosing who they target with their ability. Can force a Vigilante to shoot a Town member or redirect a Doctor\'s heal.',
    winCondition: 'Survive to see Town lose.',
    investigatorResult: 'Not Good',
  },
  {
    id: 'arsonist',
    name: 'Arsonist',
    faction: 'neutral',
    icon: Flame,
    color: 'text-neutral',
    bgColor: 'bg-neutral/10',
    borderColor: 'border-neutral/30',
    shortDesc: 'Douses and ignites',
    description: 'The Arsonist douses players in gasoline each night. At any point, they can choose to ignite instead, killing all doused players at once. Patient but deadly.',
    winCondition: 'Be the last player standing.',
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
                <h3 className="text-xs uppercase tracking-wider text-neutral-500">Town ({townRoles.length} roles)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {townRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
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
                <h3 className="text-xs uppercase tracking-wider text-neutral-500">Mafia ({mafiaRoles.length} roles)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {mafiaRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (townRoles.length + index) * 0.03 }}
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
                <h3 className="text-xs uppercase tracking-wider text-neutral-500">Neutral ({neutralRoles.length} roles)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 auto-rows-fr">
                {neutralRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (townRoles.length + mafiaRoles.length + index) * 0.03 }}
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
