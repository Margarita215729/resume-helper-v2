// Simple AI Service - Mock implementation for demo purposes
interface JobAnalysis {
    title: string
    company: string
    requirements: string[]
    skills: string[]
    location: string
}

interface ResumeData {
    personalInfo: {
        name: string
        email: string
        phone: string
        location: string
    }
    summary: string
    experience: Array<{
        title: string
        company: string
        duration: string
        description: string[]
    }>
    education: Array<{
        degree: string
        institution: string
        year: string
    }>
    skills: string[]
}

class SimpleAIService {
    
    async analyzeJobPosting(jobText: string): Promise<JobAnalysis> {
        // Mock job analysis - extract key information
        const lines = jobText.split('\n').filter(line => line.trim())
        
        return {
            title: this.extractJobTitle(jobText),
            company: this.extractCompany(jobText),
            requirements: this.extractRequirements(jobText),
            skills: this.extractSkills(jobText),
            location: this.extractLocation(jobText)
        }
    }

    async generateTailoredResume(jobAnalysis: JobAnalysis, userProfile: any[]): Promise<ResumeData> {
        // Mock resume generation based on job analysis
        const profile = this.parseUserProfile(userProfile)
        
        return {
            personalInfo: {
                name: profile.name || "John Doe",
                email: profile.email || "john.doe@email.com",
                phone: profile.phone || "(555) 123-4567",
                location: profile.location || "San Francisco, CA"
            },
            summary: this.generateSummary(jobAnalysis, profile),
            experience: this.generateExperience(jobAnalysis, profile),
            education: this.generateEducation(profile),
            skills: this.generateSkills(jobAnalysis, profile)
        }
    }

    async generateCoverLetter(jobAnalysis: JobAnalysis, userProfile: any[]): Promise<string> {
        const profile = this.parseUserProfile(userProfile)
        
        return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobAnalysis.title} position at ${jobAnalysis.company}. 

With my background in ${profile.skills?.join(', ') || 'software development'}, I am confident that I would be a valuable addition to your team.

${jobAnalysis.requirements.slice(0, 2).map(req => 
    `I have extensive experience with ${req.toLowerCase()}, which aligns perfectly with your requirements.`
).join(' ')}

I am excited about the opportunity to contribute to ${jobAnalysis.company} and would welcome the chance to discuss how my skills and experience can benefit your team.

Thank you for your consideration.

Best regards,
${profile.name || 'John Doe'}`
    }

    private extractJobTitle(text: string): string {
        const titleMatch = text.match(/(?:position|role|job):\s*([^\n]+)/i)
        return titleMatch ? titleMatch[1].trim() : "Software Developer"
    }

    private extractCompany(text: string): string {
        const companyMatch = text.match(/(?:company|at|for):\s*([^\n]+)/i)
        return companyMatch ? companyMatch[1].trim() : "Tech Company"
    }

    private extractRequirements(text: string): string[] {
        const requirements = []
        const lines = text.split('\n')
        
        for (const line of lines) {
            if (line.toLowerCase().includes('require') || line.toLowerCase().includes('must have')) {
                requirements.push(line.trim())
            }
        }
        
        return requirements.length > 0 ? requirements : [
            "Bachelor's degree in Computer Science or related field",
            "3+ years of software development experience",
            "Strong problem-solving skills"
        ]
    }

    private extractSkills(text: string): string[] {
        const commonSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']
        const foundSkills = []
        
        for (const skill of commonSkills) {
            if (text.toLowerCase().includes(skill.toLowerCase())) {
                foundSkills.push(skill)
            }
        }
        
        return foundSkills.length > 0 ? foundSkills : ['JavaScript', 'React', 'Node.js']
    }

    private extractLocation(text: string): string {
        const locationMatch = text.match(/(?:location|based in|remote|hybrid):\s*([^\n]+)/i)
        return locationMatch ? locationMatch[1].trim() : "Remote"
    }

    private parseUserProfile(userProfile: any[]): any {
        const profile: any = {}
        
        for (const item of userProfile) {
            if (item.question && item.answer) {
                const question = item.question.toLowerCase()
                
                if (question.includes('name')) {
                    profile.name = item.answer
                } else if (question.includes('email')) {
                    profile.email = item.answer
                } else if (question.includes('phone')) {
                    profile.phone = item.answer
                } else if (question.includes('location')) {
                    profile.location = item.answer
                } else if (question.includes('skill')) {
                    if (!profile.skills) profile.skills = []
                    profile.skills.push(item.answer)
                }
            }
        }
        
        return profile
    }

    private generateSummary(jobAnalysis: JobAnalysis, profile: any): string {
        return `Experienced software developer with expertise in ${jobAnalysis.skills.join(', ')}. 
        Passionate about building scalable applications and solving complex problems. 
        Seeking to contribute to ${jobAnalysis.company} as a ${jobAnalysis.title}.`
    }

    private generateExperience(jobAnalysis: JobAnalysis, profile: any): Array<any> {
        return [
            {
                title: "Senior Software Developer",
                company: "Previous Company",
                duration: "2020 - Present",
                description: [
                    `Developed applications using ${jobAnalysis.skills.slice(0, 2).join(' and ')}`,
                    "Led team of 3 developers in agile environment",
                    "Improved application performance by 40%"
                ]
            },
            {
                title: "Software Developer",
                company: "Another Company",
                duration: "2018 - 2020",
                description: [
                    "Built responsive web applications",
                    "Collaborated with cross-functional teams",
                    "Implemented automated testing procedures"
                ]
            }
        ]
    }

    private generateEducation(profile: any): Array<any> {
        return [
            {
                degree: "Bachelor of Science in Computer Science",
                institution: "University of Technology",
                year: "2018"
            }
        ]
    }

    private generateSkills(jobAnalysis: JobAnalysis, profile: any): string[] {
        const baseSkills = jobAnalysis.skills
        const additionalSkills = ['Git', 'Docker', 'AWS', 'Agile', 'Problem Solving']
        
        return [...baseSkills, ...additionalSkills].slice(0, 8)
    }
}

export const simpleAIService = new SimpleAIService()
