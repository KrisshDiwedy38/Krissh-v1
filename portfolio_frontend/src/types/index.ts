export interface Project {
    id: number;
    slug: string;
    title: string;
    short_description: string;
    description: string;
    tech_stack: string[];
    github_url: string;
    live_url: string;
    thumbnail: string;
    status: string;
    category: string;
    featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Experience {
    id: number;
    company: string;
    role: string;
    location: string;
    employment_type: string;
    description: string;
    start_date: string;
    end_date: string;
    logo: string;
    status: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    category: number;
    name: string;
    order: number;
}

export interface SkillCategory {
    id: number;
    title: string;
    subtitle: string;
    order: number;
    skills: Skill[];
}

export interface AboutMe {
    id: number;
    bio: string;
    profile_image: string;
    resume: string;
    title: string;
    core_skill: string;
    weapon: string;
    base: string;
}
