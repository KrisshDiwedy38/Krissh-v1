import PageTransition from '../components/layout/PageTransition';
import { Code, Globe, Star } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import type { Project } from '../types';

export default function Projects() {
  const { data: projects, loading, error } = useApiData<Project[]>('/projects/');

  if (loading) return <div className="text-white text-center p-8 font-pixel h-full flex items-center justify-center">LOADING PROJECTS...</div>;
  if (error) return <div className="text-[#ffabf3] text-center p-8 font-pixel h-full flex items-center justify-center">ERROR: {error}</div>;

  const projectList = projects || [];

  return (
    <PageTransition>
      <main className="flex-grow pt-8 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projectList.map((project) => {
            const techList = Array.isArray(project.tech_stack)
              ? project.tech_stack
              : [];

            return (
              <div
                key={project.id}
                className={`flex flex-col w-full relative overflow-hidden bg-[var(--color-brand-surface-2)] transition-transform hover:-translate-y-2 ${project.featured ? 'neobrutal-card shadow-[0_0_20px_rgba(255,171,243,0.6)] border-[#ffabf3]' : 'border-[3px] border-[var(--color-brand-border)]'}`}
              >
                {/* Thumbnail Image */}
                <div className="w-full aspect-video relative bg-black flex items-center justify-center overflow-hidden border-b-[3px] border-white">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="font-pixel text-6xl text-[var(--color-brand-primary)] opacity-30">{(project.title || '?').charAt(0)}</span>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title Row */}
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h2 className="font-pixel text-xl md:text-2xl text-white break-words flex items-center gap-3">
                      {project.title}
                      {project.featured && <Star size={20} className="text-[#ffabf3] fill-current" />}
                    </h2>
                    {/* Links */}
                    <div className="flex gap-3 shrink-0">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--color-brand-text)] opacity-60 hover:opacity-100 transition-opacity"
                          aria-label="GitHub Repository"
                          title="GitHub"
                        >
                          <Code size={20} />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--color-brand-text)] opacity-60 hover:opacity-100 transition-opacity"
                          aria-label="Live Site"
                          title="Live Site"
                        >
                          <Globe size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Short Description (Main Body) */}
                  <p className="font-sans text-sm md:text-base text-[var(--color-brand-text)] opacity-90 mb-6 leading-relaxed">
                    {project.short_description || (project.description || '').substring(0, 100) + '...'}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    {techList.map((tech: string, idx: number) => (
                      <span key={idx} className="font-pixel text-[10px] md:text-xs text-[var(--color-brand-primary)] bg-[rgba(0,251,251,0.1)] px-2 py-1 border border-[var(--color-brand-primary)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </PageTransition>
  );
}
