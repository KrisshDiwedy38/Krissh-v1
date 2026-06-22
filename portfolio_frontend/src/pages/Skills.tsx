import { useState, useEffect } from 'react';
import PlanetPageLayout from '../components/layout/PlanetPageLayout';
import MoonItem from '../components/ui/MoonItem';
import Chip from '../components/ui/Chip';
import api from '../api';



export default function Skills() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('/skills/')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch skills', err));
  }, []);

  return (
    <PlanetPageLayout title="SKILLS" planetColor="#ff4444">
      <div className="w-full flex flex-col lg:flex-row lg:flex-wrap lg:justify-center items-center lg:items-start lg:gap-8">
        {categories.map(category => (
          <MoonItem 
            key={category.id} 
            id={category.id} 
            title={category.title} 
            subtitle={category.subtitle}
          >
            <div className="flex flex-wrap gap-4 py-4">
              {category.skills?.map((skill: any, index: number) => (
                <Chip key={index} label={skill.name} className="!text-sm !py-2 !px-4" />
              ))}
            </div>
          </MoonItem>
        ))}
      </div>
    </PlanetPageLayout>
  );
}
