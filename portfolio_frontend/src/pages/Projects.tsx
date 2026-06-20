import { useState, useEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import TopNavStrip from '../components/layout/TopNavStrip';

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  live_url: string;
  github_url: string;
  image: string;
}

const DUMMY_PROJECTS: Project[] = [
  { 
    id: 1, 
    title: 'Tibbit – University Marketplace Platform', 
    description: 'Built a secure student-only marketplace where users could buy, sell, with ID verification and JWT-protected APIs. Integrated a PostgreSQL database to manage users, listings, and conversations. Created a React frontend featuring dynamic listings, search filters, and private messaging for smooth user interaction. Engineered the system with scalability and security in mind to support expansion across multiple universities.', 
    tech_stack: 'Django, PostgreSQL, React, JWT', 
    live_url: '#', 
    github_url: '#', 
    image: '' 
  },
  { 
    id: 2, 
    title: 'DreamHive – Social + Productivity Platform', 
    description: 'Founded and developed a hybrid social-productivity platform for entrepreneurs and innovators. Designed PostgreSQL-backed models for posts, productivity boards, and goal tracking. Built dashboards blending social interactions with productivity features to enhance engagement.', 
    tech_stack: 'Django, Redis, WebSockets, React', 
    live_url: '#', 
    github_url: '#', 
    image: '' 
  },
  { 
    id: 3, 
    title: 'Encrypted File Vault (LocalSafe)', 
    description: 'Built a CLI-based file vault that securely encrypts files with AES-256 and protects access with a master password. Added auto-lock and SQLite-based metadata tracking to improve security and traceability. Designed modular CLI commands with argparse, making the tool easy to use and resilient to errors.', 
    tech_stack: 'Python, SQLite, AES-256', 
    live_url: '#', 
    github_url: '#', 
    image: '' 
  },
  { 
    id: 4, 
    title: 'F1 Race Winner Predictor', 
    description: 'Built an ML pipeline predicting Formula 1 race outcomes using multi-season driver, team, and circuit data. Engineered predictive features and benchmarked XGBoost against logistic regression and random forests. Developed an interactive Streamlit dashboard to visualize predictions, performance trends, and scenario analysis.', 
    tech_stack: 'XGBoost, Pandas, Supabase, Streamlit', 
    live_url: '#', 
    github_url: '#', 
    image: '' 
  }
];

const MOON_COLORS = ['#00dddd', '#ffabf3', '#00dddd', '#ffabf3', '#00dddd', '#ffabf3'];
const SUBTITLES = ['Autonomous Core', 'Signal Decoder', 'Terminal Interface', 'Legacy Engine', 'Dynamics Tool', 'Asset Cluster'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects/')
      .then(r => r.json())
      .then(data => { if (data.length) setProjects(data); })
      .catch(() => { });
  }, []);

  return (
    <PageTransition>
      <TopNavStrip />



      {/* Moon Grid */}
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
          {projects.map((project, i) => (
            <div key={project.id} className="group cursor-pointer flex flex-col items-center" onClick={() => setSelectedProject(project)}>
              <div
                className="w-48 h-48 rounded-full border-4 border-white overflow-hidden transition-all duration-300 flex items-center justify-center bg-[var(--color-brand-surface-2)] relative animate-float"
                style={{
                  boxShadow: `0 0 20px ${MOON_COLORS[i % MOON_COLORS.length]}40`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                <div className="font-pixel text-2xl text-white">{project.title.charAt(0)}</div>
                <div className="absolute inset-0 bg-[var(--color-brand-primary)]/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-8 text-center">
                <h3 className="font-pixel text-base text-[var(--color-brand-secondary)]">{project.title}</h3>
                <p className="font-sans text-xs text-[var(--color-brand-text)] opacity-50 mt-2 uppercase tracking-tighter">{SUBTITLES[i % SUBTITLES.length]}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" style={{ backdropFilter: 'blur(8px)', background: 'rgba(5,5,21,0.8)' }} onClick={() => setSelectedProject(null)}>
          <div className="bg-[var(--color-brand-surface-2)] w-full max-w-2xl border-[3px] border-white shadow-[12px_12px_0px_0px_#ffabf3] p-8 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-[var(--color-brand-secondary)] transition-colors text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center p-2" onClick={() => setSelectedProject(null)}>✕</button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 border-[3px] border-white bg-black aspect-square flex items-center justify-center">
                <span className="font-pixel text-6xl text-[var(--color-brand-primary)]">{selectedProject.title.charAt(0)}</span>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="font-sans text-xs text-[var(--color-brand-primary-tint)] uppercase mb-2">SYSTEM // {selectedProject.tech_stack}</span>
                <h2 className="font-pixel text-2xl text-white mb-4">{selectedProject.title}</h2>
                <p className="font-sans text-sm text-[var(--color-brand-text)] opacity-70 mb-8">{selectedProject.description}</p>
                <div className="flex flex-col gap-4">
                  <a href={selectedProject.live_url} className="neobrutal-btn-primary text-center">Launch Mission</a>
                  <a href={selectedProject.github_url} className="border-[3px] border-white py-3 px-6 text-center text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all font-sans">Source Code</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
