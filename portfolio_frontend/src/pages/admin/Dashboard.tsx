import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
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
        <PageTransition className="px-4 py-6 pt-24 md:px-12 md:py-12 md:pt-24 max-w-[1440px] mx-auto w-full flex-col gap-4">
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

            <div className="flex gap-4 mb-8 flex-wrap">
                <Button 
                    variant={activeTab === 'about' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('about')}
                    className="!py-2 text-sm md:text-base"
                >
                    ABOUT ME
                </Button>
                <Button 
                    variant={activeTab === 'skills' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('skills')}
                    className="!py-2 text-sm md:text-base"
                >
                    SKILLS
                </Button>
                <Button 
                    variant={activeTab === 'projects' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('projects')}
                    className="!py-2 text-sm md:text-base"
                >
                    PROJECTS
                </Button>
                <Button 
                    variant={activeTab === 'experience' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('experience')}
                    className="!py-2 text-sm md:text-base"
                >
                    EXPERIENCE
                </Button>
                
                <div className="flex-1 min-w-[20px]"></div>
                
                {(activeTab === 'projects' || activeTab === 'experience') && (
                    <Button 
                        variant="primary"
                        onClick={() => navigate(`/admin/${activeTab}/new`)}
                        className="!py-2 !bg-[var(--color-brand-secondary)] !text-white !shadow-[6px_6px_0px_0px_var(--color-brand-primary)] hover:!shadow-[2px_2px_0px_0px_var(--color-brand-primary)] active:!shadow-[2px_2px_0px_0px_var(--color-brand-primary)]"
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
