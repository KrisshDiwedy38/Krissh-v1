import { useState, useEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import api from '../api';

interface Experience {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const SHADOW_COLORS = ['#ffabf3', '#00fbfb', '#ffabf3'];
  const BORDER_COLORS = ['var(--color-brand-secondary)', 'var(--color-brand-primary-tint)', 'var(--color-brand-tertiary)'];
  const BADGE_STYLES = [
    { bg: 'bg-[var(--color-brand-secondary)]', text: 'text-[var(--color-brand-on-secondary)]' },
    { bg: 'bg-[var(--color-brand-primary)]', text: 'text-black' },
    { bg: 'bg-[var(--color-brand-tertiary)]', text: 'text-black' },
  ];

  useEffect(() => {
    api.get('/experience/')
      .then(res => { if (res.data.length) setExperiences(res.data); })
      .catch(err => console.error('Failed to fetch experience', err));
  }, []);

  return (
    <PageTransition>
      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-8 py-8 relative">
        <div className="flex flex-col gap-24 relative">
          {experiences.map((exp, i) => (
            <div key={exp.id} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 group`}>
              {/* Circle */}
              <div className="relative shrink-0">
                <div
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[3px] bg-[var(--color-brand-surface-2)] flex items-center justify-center overflow-hidden transition-all group-hover:scale-105"
                  style={{ borderColor: BORDER_COLORS[i % BORDER_COLORS.length], boxShadow: `6px 6px 0px 0px ${SHADOW_COLORS[i % SHADOW_COLORS.length]}` }}
                >
                  <span className="font-pixel text-3xl text-white">{exp.company.charAt(0)}</span>
                </div>
              </div>
              {/* Card */}
              <div
                className="flex-grow p-4 md:p-8 bg-[var(--color-brand-surface-2)] border-[3px] border-white transition-all"
                style={{ boxShadow: `6px 6px 0px 0px ${SHADOW_COLORS[i % SHADOW_COLORS.length]}` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <span className="font-sans text-xs uppercase mb-2 block" style={{ color: SHADOW_COLORS[i % SHADOW_COLORS.length] }}>{exp.company}</span>
                    <h2 className="font-pixel text-xl md:text-2xl text-white">{exp.role}</h2>
                  </div>
                  <div className={`mt-4 md:mt-0 px-4 py-2 ${BADGE_STYLES[i % BADGE_STYLES.length].bg} ${BADGE_STYLES[i % BADGE_STYLES.length].text} font-bold font-sans text-sm`}>
                    {exp.start_date} - {exp.end_date}
                  </div>
                </div>
                <p className="font-sans text-sm text-[var(--color-brand-text)] opacity-70 mb-6 border-l-4 pl-4" style={{ borderColor: SHADOW_COLORS[i % SHADOW_COLORS.length] }}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 py-8 my-24">
        <div className="border-[3px] border-white bg-[var(--color-brand-bg)] p-8 neobrutal-shadow-secondary text-center">
          <h3 className="font-pixel text-2xl text-white mb-6">ESTABLISH COMMS?</h3>
          <p className="font-sans text-lg text-[var(--color-brand-text)] opacity-70 mb-8">Interested in collaborating on the next frontier? Signal me through the subspace link.</p>
          <button className="neobrutal-btn-primary" onClick={() => window.location.href = '/contact'}>TRANSMIT</button>
        </div>
      </section>
    </PageTransition>
  );
}
