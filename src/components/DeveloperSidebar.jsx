import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Zap, FolderOpen, GraduationCap, Terminal, MessageSquare, X } from 'lucide-react';

const NAV = [
  { id: 'hero',       label: 'profile.ts',      icon: User,          num: '01' },
  { id: 'experience', label: 'experience.json', icon: Briefcase,     num: '02' },
  { id: 'skills',     label: 'skills.config',   icon: Zap,           num: '03' },
  { id: 'projects',   label: 'projects/',        icon: FolderOpen,    num: '04' },
  { id: 'education',  label: 'education.md',     icon: GraduationCap, num: '05' },
  { id: 'terminal',   label: 'terminal.sh',      icon: Terminal,      num: '06' },
  { id: 'contact',    label: 'contact.sh',       icon: MessageSquare, num: '07' },
];

const listVariants = {
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
};
const itemVariants = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

export default function DeveloperSidebar({ activeSection, onNavigate, mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 45,
              background: 'rgba(5,11,20,0.80)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />
        )}
      </AnimatePresence>

      <aside
        aria-label="Developer navigation"
        style={{
          position: 'fixed',
          top: 'var(--topbar-h)',
          left: 0,
          bottom: 'var(--statusbar-h)',
          width: 'clamp(260px, 75vw, 300px)',
          zIndex: 50,
          background: 'var(--base-900)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
        className="lg:!translate-x-0 lg:!w-[var(--sidebar-w)]"
      >
        {/* Header */}
        <div
          className="px-3 py-2.5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}
        >
          <span className="font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontSize: '8px' }}>
            EXPLORER
          </span>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--border)' }} />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--border)' }} />
            </div>
            <motion.button
              className="lg:hidden flex items-center justify-center w-6 h-6 rounded"
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              aria-label="Close navigation"
              style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={14} />
            </motion.button>
          </div>
        </div>

        {/* Folder label */}
        <div className="px-3 py-2 flex items-center gap-1" style={{ flexShrink: 0 }}>
          <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>▾ portfolio</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-1" role="navigation">
          <motion.ul
            className="space-y-0.5 pb-2"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {NAV.map(({ id, label, icon: Icon, num }) => {
              const isActive = activeSection === id;
              return (
                <motion.li key={id} variants={itemVariants}>
                  <motion.button
                    onClick={() => { onNavigate(id); onClose?.(); }}
                    aria-current={isActive ? 'page' : undefined}
                    whileHover={{ x: isActive ? 0 : 3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 12px',
                      borderRadius: 4,
                      textAlign: 'left',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isActive ? 'rgba(57,255,136,0.08)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s',
                      minHeight: 40,
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        style={{
                          position: 'absolute', left: 0, top: 3, bottom: 3,
                          width: 2, borderRadius: '0 2px 2px 0',
                          background: 'var(--green-neon)',
                          boxShadow: '0 0 6px var(--green-neon)',
                        }}
                      />
                    )}
                    <span className="font-mono" style={{ color: isActive ? 'var(--green-neon)' : 'var(--text-muted)', fontSize: '8px', width: 18, flexShrink: 0 }}>{num}</span>
                    <Icon size={13} style={{ color: isActive ? 'var(--green-neon)' : 'var(--text-muted)', flexShrink: 0 }} />
                    <span className="font-mono truncate" style={{ fontSize: '12px' }}>{label}</span>
                  </motion.button>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* Bottom status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="px-3 py-3 space-y-1.5"
          style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}
        >
          <div className="flex items-center gap-2">
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span className="font-mono" style={{ color: 'var(--green-neon)', fontSize: '9px' }}>AVAILABLE</span>
          </div>
          <p className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '8px' }}>📍 Chennai, India</p>
          <p className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '8px' }}>git: main ●</p>
        </motion.div>
      </aside>
    </>
  );
}
