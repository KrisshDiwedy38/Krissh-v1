import PlanetPageLayout from '../components/layout/PlanetPageLayout';
import MoonItem from '../components/ui/MoonItem';
import Chip from '../components/ui/Chip';

// Cosmic dummy data for skills
const SKILL_CATEGORIES = [
  {
    id: 1,
    title: 'CORE LANGUAGES',
    subtitle: 'Base Systems',
    skills: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL']
  },
  {
    id: 2,
    title: 'FRONTEND',
    subtitle: 'Display Interfaces',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'HTML/CSS']
  },
  {
    id: 3,
    title: 'BACKEND',
    subtitle: 'Server Cores',
    skills: ['Django', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs']
  },
  {
    id: 4,
    title: 'TOOLS & DEVOPS',
    subtitle: 'Navigational Utilities',
    skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Supabase', 'Linux']
  }
];

export default function Skills() {
  return (
    <PlanetPageLayout title="SKILLS" planetColor="#ff4444">
      <div className="w-full flex flex-col items-center">
        {SKILL_CATEGORIES.map(category => (
          <MoonItem 
            key={category.id} 
            id={category.id} 
            title={category.title} 
            subtitle={category.subtitle}
          >
            <div className="flex flex-wrap gap-4 py-4">
              {category.skills.map((skill, index) => (
                <Chip key={index} label={skill} className="!text-sm !py-2 !px-4" />
              ))}
            </div>
          </MoonItem>
        ))}
      </div>
    </PlanetPageLayout>
  );
}
