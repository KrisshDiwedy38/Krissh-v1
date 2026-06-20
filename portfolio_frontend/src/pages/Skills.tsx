import PlanetPageLayout from '../components/layout/PlanetPageLayout';
import MoonItem from '../components/ui/MoonItem';
import Chip from '../components/ui/Chip';

// Cosmic dummy data for skills
const SKILL_CATEGORIES = [
  {
    id: 1,
    title: 'LANGUAGES',
    subtitle: 'Base Systems',
    skills: ['Python', 'C++', 'SQL', 'JavaScript', 'R', 'C', 'HTML5', 'CSS']
  },
  {
    id: 2,
    title: 'FRAMEWORKS & LIBRARIES',
    subtitle: 'Display Interfaces & Cores',
    skills: ['Pandas', 'NumPy', 'Scikit-learn', 'Hugging Face Transformers', 'Bootstrap', 'React', 'Django']
  },
  {
    id: 3,
    title: 'DATABASES & TOOLS',
    subtitle: 'Navigational Utilities',
    skills: ['PostgreSQL', 'Supabase', 'Git', 'Tableau', 'Anaconda', 'Redis']
  }
];

export default function Skills() {
  return (
    <PlanetPageLayout title="SKILLS" planetColor="#ff4444">
      <div className="w-full flex flex-col lg:flex-row lg:flex-wrap lg:justify-center items-center lg:items-start lg:gap-8">
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
