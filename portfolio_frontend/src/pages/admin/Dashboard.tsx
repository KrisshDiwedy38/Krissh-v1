import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import PageTransition from '../../components/layout/PageTransition';
import Button from '../../components/ui/Button';

import ProjectsTable from './ProjectsTable';
import ExperienceTable from './ExperienceTable';
import AboutMeTab from './AboutMeTab';
import SkillsTab from './SkillsTab';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'projects' | 'experience'>('about');
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <PageTransition className="p-4 md:p-6 pt-24 md:pt-24 max-w-[960px] mx-auto w-full flex flex-col gap-4 md:gap-6">
            <header className="flex justify-between items-center mb-12 border-b-[3px] border-[var(--color-brand-border-muted)] pb-6">
                <div>
                    <h1 className="font-pixel text-2xl md:text-4xl text-[var(--color-brand-primary)]">ADMIN PANEL</h1>
                    <p className="font-sans text-sm tracking-widest uppercase mt-2 opacity-80">Command Center</p>
                </div>
                <Button
                    variant="secondary"
                    onClick={logout}
                    className="!border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-black text-xs md:text-sm !py-2"
                >
                    LOGOUT
                </Button>
            </header>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div className="flex flex-col md:flex-row gap-3">
                    <Button
                        variant={activeTab === 'about' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('about')}
                        className="!w-full md:!w-auto !py-3 md:!py-2 text-sm md:text-base text-center"
                    >
                        ABOUT ME
                    </Button>
                    <Button
                        variant={activeTab === 'skills' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('skills')}
                        className="!w-full md:!w-auto !py-3 md:!py-2 text-sm md:text-base text-center"
                    >
                        SKILLS
                    </Button>
                    <Button
                        variant={activeTab === 'projects' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('projects')}
                        className="!w-full md:!w-auto !py-3 md:!py-2 text-sm md:text-base text-center"
                    >
                        PROJECTS
                    </Button>
                    <Button
                        variant={activeTab === 'experience' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('experience')}
                        className="!w-full md:!w-auto !py-3 md:!py-2 text-sm md:text-base text-center"
                    >
                        EXPERIENCE
                    </Button>
                </div>

                {(activeTab === 'projects' || activeTab === 'experience') && (
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/admin/${activeTab}/new`)}
                        className="!w-full md:!w-auto !py-3 md:!py-2 !bg-[var(--color-brand-secondary)] !text-white !shadow-[4px_4px_0px_0px_var(--color-brand-primary)] md:!shadow-[6px_6px_0px_0px_var(--color-brand-primary)] hover:!shadow-[2px_2px_0px_0px_var(--color-brand-primary)] active:!shadow-[2px_2px_0px_0px_var(--color-brand-primary)] mt-4 md:mt-0"
                    >
                        + NEW {activeTab.toUpperCase()}
                    </Button>
                )}
            </div>

            <div className="w-full">
                {activeTab === 'about' && <AboutMeTab />}
                {activeTab === 'skills' && <SkillsTab />}
                {activeTab === 'projects' && <ProjectsTable />}
                {activeTab === 'experience' && <ExperienceTable />}
            </div>
        </PageTransition>
    );
}
