import { useState } from 'react';
import PlanetPageLayout from '../components/layout/PlanetPageLayout';
import MoonItem from '../components/ui/MoonItem';
import Chip from '../components/ui/Chip';
import { useApiData } from '../hooks/useApiData';
import type { SkillCategory } from '../types';

export default function Skills() {
  const [expandedId, setExpandedId] = useState<number | string | null>(null);
  const { data: categories, loading, error } = useApiData<SkillCategory[]>('/skills/');

  if (loading) return <div className="text-white text-center p-8 font-pixel h-full flex items-center justify-center">LOADING SKILLS...</div>;
  if (error) return <div className="text-[#ffabf3] text-center p-8 font-pixel h-full flex items-center justify-center">ERROR: {error}</div>;

  const categoryList = categories || [];

  return (
    <PlanetPageLayout title="SKILLS" planetColor="#ff4444">
      <div className="w-full flex flex-col xl:flex-row gap-6 min-h-[500px] items-start">
        {categoryList.map(category => {
          const isExpanded = expandedId === category.id;
          return (
            <div 
              key={category.id} 
              className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col w-full ${isExpanded ? 'xl:flex-[2_2_0%]' : 'xl:flex-[1_1_0%]'}`}
            >
              <MoonItem 
                id={category.id} 
                title={category.title} 
                subtitle={category.subtitle}
                isExpanded={isExpanded}
                onToggle={() => setExpandedId(isExpanded ? null : category.id)}
              >
                <div className="flex flex-wrap gap-4 py-4">
                  {category.skills?.map((skill, index) => (
                    <Chip key={index} label={skill.name} className="!text-sm !py-2 !px-4" />
                  ))}
                </div>
              </MoonItem>
            </div>
          );
        })}
      </div>
    </PlanetPageLayout>
  );
}
