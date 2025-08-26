export interface PersonalInfo {
    fullName: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
    summary: string
}

export interface Experience {
    id: string
    position: string
    company: string
    location: string
    startDate: Date
    endDate?: Date
    current: boolean
    description: string[]
    skills: string[]
}

export interface Education {
    id: string
    degree: string
    institution: string
    location: string
    graduationDate: Date
    gpa?: string
    coursework?: string[]
}

export interface Skill {
    id: string
    name: string
    category: string
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
    yearsOfExperience: number
}

export interface Project {
    id: string
    name: string
    description: string
    technologies: string[]
    link?: string
    github?: string
}

export interface Language {
    id: string
    name: string
    proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native'
}

export interface Certification {
    id: string
    name: string
    issuer: string
    date: Date
    expirationDate?: Date
    credentialId?: string
}

export interface Resume {
    id: string
    personalInfo: PersonalInfo
    experience: Experience[]
    education: Education[]
    skills: Skill[]
    projects: Project[]
    languages: Language[]
    certifications: Certification[]
    createdAt: Date
    updatedAt: Date
}

export interface JobPosting {
    title: string
    company: string
    description: string
    requirements: string[]
    preferredSkills: string[]
    location: string
}

export interface QuestionnaireResponse {
    category: string
    question: string
    answer: string
    weight: number
}
