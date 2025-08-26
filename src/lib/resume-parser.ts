// Resume Parser Library for extracting data from uploaded resumes

export interface ParsedResumeData {
    personalInfo: {
        name?: string
        email?: string
        phone?: string
        location?: string
        linkedin?: string
        github?: string
        website?: string
    }
    experience: Array<{
        title: string
        company: string
        duration: string
        description: string
        startDate?: string
        endDate?: string
        current?: boolean
    }>
    education: Array<{
        degree: string
        institution: string
        year?: string
        gpa?: string
        honors?: string
    }>
    skills: {
        technical: string[]
        soft: string[]
        languages: Array<{
            language: string
            level: string
        }>
        certifications: string[]
    }
    projects: Array<{
        name: string
        description: string
        technologies: string[]
        url?: string
    }>
    achievements: string[]
    summary?: string
}

export class ResumeParser {
    private static instance: ResumeParser

    static getInstance(): ResumeParser {
        if (!ResumeParser.instance) {
            ResumeParser.instance = new ResumeParser()
        }
        return ResumeParser.instance
    }

    async parseFile(file: File): Promise<ParsedResumeData> {
        const text = await this.extractTextFromFile(file)
        return this.parseText(text)
    }

    private async extractTextFromFile(file: File): Promise<string> {
        const fileType = file.type.toLowerCase()

        if (fileType.includes('text/plain')) {
            return await file.text()
        }

        if (fileType.includes('application/pdf')) {
            return await this.extractFromPDF(file)
        }

        if (fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
            fileType.includes('application/msword')) {
            return await this.extractFromWord(file)
        }

        throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.')
    }

    private async extractFromPDF(file: File): Promise<string> {
        // For now, return a placeholder. In production, you'd use a PDF parser like pdf-parse
        // or integrate with a service like DocumentAI
        return `PDF parsing not implemented yet. File: ${file.name}`
    }

    private async extractFromWord(file: File): Promise<string> {
        // For now, return a placeholder. In production, you'd use mammoth.js or similar
        return `DOCX parsing not implemented yet. File: ${file.name}`
    }

    parseText(text: string): ParsedResumeData {
        const result: ParsedResumeData = {
            personalInfo: {},
            experience: [],
            education: [],
            skills: {
                technical: [],
                soft: [],
                languages: [],
                certifications: []
            },
            projects: [],
            achievements: []
        }

        // Extract personal information
        result.personalInfo = this.extractPersonalInfo(text)

        // Extract experience
        result.experience = this.extractExperience(text)

        // Extract education
        result.education = this.extractEducation(text)

        // Extract skills
        result.skills = this.extractSkills(text)

        // Extract projects
        result.projects = this.extractProjects(text)

        // Extract achievements
        result.achievements = this.extractAchievements(text)

        // Extract summary
        result.summary = this.extractSummary(text)

        return result
    }

    private extractPersonalInfo(text: string): ParsedResumeData['personalInfo'] {
        const info: ParsedResumeData['personalInfo'] = {}

        // Email extraction
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
        if (emailMatch) {
            info.email = emailMatch[0]
        }

        // Phone extraction
        const phoneMatch = text.match(/[\+]?[1-9][\d\s\-\(\)]{8,15}/g)
        if (phoneMatch) {
            info.phone = phoneMatch[0]
        }

        // LinkedIn extraction
        const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-_]+/g)
        if (linkedinMatch) {
            info.linkedin = linkedinMatch[0]
        }

        // GitHub extraction
        const githubMatch = text.match(/github\.com\/[a-zA-Z0-9-_]+/g)
        if (githubMatch) {
            info.github = githubMatch[0]
        }

        // Name extraction (simple heuristic - first line that looks like a name)
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        for (const line of lines.slice(0, 5)) {
            if (this.looksLikeName(line)) {
                info.name = line
                break
            }
        }

        return info
    }

    private looksLikeName(text: string): boolean {
        // Simple heuristic: 2-4 words, no special characters except spaces, dashes, apostrophes
        const words = text.split(/\s+/)
        if (words.length < 2 || words.length > 4) return false

        return words.every(word => /^[a-zA-Z\-']+$/.test(word))
    }

    private extractExperience(text: string): ParsedResumeData['experience'] {
        const experience: ParsedResumeData['experience'] = []

        // Look for experience sections
        const experienceKeywords = ['experience', 'employment', 'work history', 'professional experience']
        const sections = this.extractSections(text, experienceKeywords)

        for (const section of sections) {
            const jobs = this.parseJobEntries(section)
            experience.push(...jobs)
        }

        return experience
    }

    private extractEducation(text: string): ParsedResumeData['education'] {
        const education: ParsedResumeData['education'] = []

        const educationKeywords = ['education', 'academic background', 'qualifications']
        const sections = this.extractSections(text, educationKeywords)

        for (const section of sections) {
            const degrees = this.parseEducationEntries(section)
            education.push(...degrees)
        }

        return education
    }

    private extractSkills(text: string): ParsedResumeData['skills'] {
        const skills: ParsedResumeData['skills'] = {
            technical: [],
            soft: [],
            languages: [],
            certifications: []
        }

        // Technical skills extraction
        const techKeywords = ['skills', 'technical skills', 'technologies', 'programming languages']
        const techSections = this.extractSections(text, techKeywords)

        for (const section of techSections) {
            const extractedSkills = this.parseSkillsList(section)
            skills.technical.push(...extractedSkills)
        }

        // Language extraction
        const langKeywords = ['languages', 'language skills']
        const langSections = this.extractSections(text, langKeywords)

        for (const section of langSections) {
            const languages = this.parseLanguages(section)
            skills.languages.push(...languages)
        }

        return skills
    }

    private extractProjects(text: string): ParsedResumeData['projects'] {
        const projects: ParsedResumeData['projects'] = []

        const projectKeywords = ['projects', 'portfolio', 'personal projects']
        const sections = this.extractSections(text, projectKeywords)

        for (const section of sections) {
            const projectList = this.parseProjectEntries(section)
            projects.push(...projectList)
        }

        return projects
    }

    private extractAchievements(text: string): string[] {
        const achievements: string[] = []

        const achievementKeywords = ['achievements', 'accomplishments', 'awards', 'honors']
        const sections = this.extractSections(text, achievementKeywords)

        for (const section of sections) {
            const items = this.parseListItems(section)
            achievements.push(...items)
        }

        return achievements
    }

    private extractSummary(text: string): string | undefined {
        const summaryKeywords = ['summary', 'profile', 'objective', 'about']
        const sections = this.extractSections(text, summaryKeywords)

        return sections.length > 0 ? sections[0].trim() : undefined
    }

    private extractSections(text: string, keywords: string[]): string[] {
        const sections: string[] = []
        const lines = text.split('\n')

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase().trim()

            for (const keyword of keywords) {
                if (line.includes(keyword)) {
                    // Extract content until next section
                    let sectionContent = ''
                    for (let j = i + 1; j < lines.length; j++) {
                        const nextLine = lines[j].trim()
                        if (this.looksLikeSectionHeader(nextLine)) {
                            break
                        }
                        sectionContent += nextLine + '\n'
                    }
                    if (sectionContent.trim()) {
                        sections.push(sectionContent.trim())
                    }
                    break
                }
            }
        }

        return sections
    }

    private looksLikeSectionHeader(line: string): boolean {
        const commonHeaders = [
            'experience', 'education', 'skills', 'projects', 'achievements',
            'certifications', 'languages', 'references', 'interests'
        ]

        const lowerLine = line.toLowerCase()
        return commonHeaders.some(header => lowerLine.includes(header)) && line.length < 50
    }

    private parseJobEntries(text: string): ParsedResumeData['experience'] {
        // Simplified job parsing - would be more sophisticated in production
        const jobs: ParsedResumeData['experience'] = []

        const lines = text.split('\n').filter(l => l.trim().length > 0)
        let currentJob: Partial<ParsedResumeData['experience'][0]> | null = null

        for (const line of lines) {
            if (this.looksLikeJobTitle(line)) {
                if (currentJob) {
                    jobs.push(currentJob as ParsedResumeData['experience'][0])
                }
                const parts = line.split(' at ')
                currentJob = {
                    title: parts[0] || line,
                    company: parts[1] || '',
                    duration: '',
                    description: ''
                }
            } else if (currentJob && this.looksLikeDuration(line)) {
                currentJob.duration = line
            } else if (currentJob && line.trim().startsWith('•') || line.trim().startsWith('-')) {
                if (currentJob) {
                    currentJob.description += line + '\n'
                }
            }
        }

        if (currentJob) {
            jobs.push(currentJob as ParsedResumeData['experience'][0])
        }

        return jobs
    }

    private parseEducationEntries(text: string): ParsedResumeData['education'] {
        // Simplified education parsing
        const education: ParsedResumeData['education'] = []
        const lines = text.split('\n').filter(l => l.trim().length > 0)

        for (const line of lines) {
            if (this.looksLikeDegree(line)) {
                education.push({
                    degree: line,
                    institution: '',
                    year: this.extractYear(line)
                })
            }
        }

        return education
    }

    private parseSkillsList(text: string): string[] {
        const skills: string[] = []
        const lines = text.split('\n')

        for (const line of lines) {
            // Split by common delimiters
            const lineSkills = line.split(/[,;|•\-]/)
                .map(s => s.trim())
                .filter(s => s.length > 0 && s.length < 30)

            skills.push(...lineSkills)
        }

        return [...new Set(skills)] // Remove duplicates
    }

    private parseLanguages(text: string): Array<{ language: string, level: string }> {
        const languages: Array<{ language: string, level: string }> = []
        const lines = text.split('\n')

        for (const line of lines) {
            const match = line.match(/([a-zA-Z\s]+)\s*[-:]?\s*(native|fluent|advanced|intermediate|basic|conversational)/i)
            if (match) {
                languages.push({
                    language: match[1].trim(),
                    level: match[2].toLowerCase()
                })
            }
        }

        return languages
    }

    private parseProjectEntries(_text: string): ParsedResumeData['projects'] {
        // Simplified project parsing - would be more sophisticated in production
        return []
    }

    private parseListItems(text: string): string[] {
        return text.split('\n')
            .map(l => l.trim())
            .filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
            .map(l => l.substring(1).trim())
    }

    private looksLikeJobTitle(line: string): boolean {
        const jobTitleWords = ['developer', 'engineer', 'manager', 'analyst', 'consultant', 'director', 'coordinator']
        const lowerLine = line.toLowerCase()
        return jobTitleWords.some(word => lowerLine.includes(word)) || line.includes(' at ')
    }

    private looksLikeDuration(line: string): boolean {
        return /\d{4}/.test(line) && (line.includes('-') || line.includes('to') || line.includes('present'))
    }

    private looksLikeDegree(line: string): boolean {
        const degreeWords = ['bachelor', 'master', 'phd', 'diploma', 'certificate', 'degree']
        const lowerLine = line.toLowerCase()
        return degreeWords.some(word => lowerLine.includes(word))
    }

    private extractYear(text: string): string | undefined {
        const yearMatch = text.match(/\b(19|20)\d{2}\b/)
        return yearMatch ? yearMatch[0] : undefined
    }
}

export default ResumeParser
