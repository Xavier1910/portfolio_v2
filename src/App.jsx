import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BootLoader from './components/BootLoader';
import CustomCursor from './components/CustomCursor';
import TopBar from './components/TopBar';
import DeveloperSidebar from './components/DeveloperSidebar';
import StatusBar from './components/StatusBar';
import HeroTerminal from './components/HeroTerminal';
import ExperienceTimeline from './components/ExperienceTimeline';
import SkillsMap from './components/SkillsMap';
import RepositoryCards from './components/RepositoryCards';
import EducationLog from './components/EducationLog';
import SuperTerminal, { SiteEffectLayer } from './components/SuperTerminal';
import ContactConsole from './components/ContactConsole';
import Footer from './components/Footer';
import useScrollReveal from './hooks/useScrollReveal';
import CodeRain from './components/CodeRain';

const SECTIONS = ['hero', 'experience', 'skills', 'projects', 'education', 'terminal', 'contact'];

export const siteEffects = {
  trigger: (effect) => window.dispatchEvent(new CustomEvent('site-effect', { detail: effect }))
};

function WorkspaceContent({ workspaceRef }) {
  useScrollReveal();

  return (
    <div
      ref={workspaceRef}
      className="workspace flex-1 overflow-y-auto overflow-x-hidden"
      tabIndex={-1}
    >
      <CodeRain opacity={0.055} />
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute pointer-events-none" style={{
        top: '10%', left: '30%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(57,255,136,0.04) 0%, transparent 70%)',
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: '10%', right: '10%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,207,255,0.03) 0%, transparent 70%)',
      }} />

      <HeroTerminal />
      <div className="sep" />
      <ExperienceTimeline />
      <div className="sep" />
      <SkillsMap />
      <div className="sep" />
      <RepositoryCards />
      <div className="sep" />
      <EducationLog />
      <div className="sep" />
      <ContactConsole />
      <Footer />
    </div>
  );
}

// ── Main workspace fade-in variants ─────────────────────────────
const workspaceVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const workspaceRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileNavOpen);
    const onKey = (e) => { if (e.key === 'Escape' && mobileNavOpen) setMobileNavOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('nav-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (booted && workspaceRef.current) {
      workspaceRef.current.scrollTop = 0;
      workspaceRef.current.focus({ preventScroll: true });
    }
  }, [booted]);

  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;
    const onScroll = () => {
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? (el.scrollTop / total) * 100 : 0;
      setScrollProgress(Math.min(100, pct));
      SECTIONS.forEach(id => {
        const section = el.querySelector(`#${id}`);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= el.clientHeight * 0.45 && rect.bottom >= 80) {
            setActiveSection(id);
          }
        }
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [booted]);

  const navigateTo = (sectionId) => {
    const el = workspaceRef.current;
    if (!el) return;
    const target = el.querySelector(`#${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  return (
    <>
      {/* Boot loader with exit animation */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="bootloader"
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
          >
            <BootLoader onDone={() => setBooted(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app */}
      <AnimatePresence>
        {booted && (
          <motion.div
            key="app"
            initial="hidden"
            animate="visible"
            variants={workspaceVariants}
            className="fixed inset-0 flex flex-col"
            style={{ overflow: 'hidden' }}
          >
            <CustomCursor />

            <div
              id="scroll-progress"
              style={{ width: `${scrollProgress}%` }}
            />

            <TopBar
              activeSection={activeSection}
              mobileNavOpen={mobileNavOpen}
              onToggleMobileNav={() => setMobileNavOpen(v => !v)}
            />
            <SiteEffectLayer />

            <DeveloperSidebar
              activeSection={activeSection}
              onNavigate={navigateTo}
              mobileOpen={mobileNavOpen}
              onClose={() => setMobileNavOpen(false)}
            />

            <div
              className="flex flex-col"
              style={{
                marginTop: 'var(--topbar-h)',
                marginBottom: 'var(--statusbar-h)',
                flex: 1,
                overflow: 'hidden',
              }}
            >
              <WorkspaceContent workspaceRef={workspaceRef} />
            </div>

            <StatusBar activeSection={activeSection} />

            <style>{`
              @media (min-width: 1024px) {
                .workspace { margin-left: var(--sidebar-w); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      <SuperTerminal />
    </>
  );
}
