export interface About {
  shortName: string;
  fullName: string;
  job: string;
  workplace: string;
  profileImage?: string;
  socialMedia: {
    email?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  description: string;
  experiences: Experience[];
  educations: Education[];
  techStack: TechStack[];
  interests: Interest[];
}

export interface TechStack {
  name: string;
  icon: string;
  color: string;
}

export interface Interest {
  name: string;
  icon: string;
  color: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Portfolio {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
  video?: string;
  tags?: string[];
  images?: string[];
  slug: string;
}

export interface Blog {
  id: string;
  title: string;
  date: string;
  tags: string[];
  image: string;
  content: string;
  excerpt?: string;
  slug: string;
}

export interface AppData {
  about: About;
  portfolio: Portfolio[];
  blog: Blog[];
}