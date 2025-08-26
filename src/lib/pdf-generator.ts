import { JobPosting, QuestionnaireResponse } from '@/types/resume'
import jsPDF from 'jspdf'

export interface PDFOptions {
    template: 'classic' | 'modern' | 'ats-optimized' | 'creative'
    fontSize: 'small' | 'medium' | 'large'
    colorScheme: 'black-white' | 'blue-accent' | 'professional'
}

export class PDFGenerator {
    private doc: jsPDF
    private currentY: number = 20
    private pageHeight: number = 280
    private leftMargin: number = 20
    private rightMargin: number = 20
    private pageWidth: number = 210

    constructor(private options: PDFOptions = { template: 'classic', fontSize: 'medium', colorScheme: 'black-white' }) {
        this.doc = new jsPDF('p', 'mm', 'a4')
        this.setupFonts()
    }

    private setupFonts() {
        // Set up default fonts and sizes based on options
        const fontSize = this.options.fontSize === 'small' ? 10 : this.options.fontSize === 'large' ? 14 : 12
        this.doc.setFontSize(fontSize)
    }

    private addHeader(name: string, contact: QuestionnaireResponse[]) {
        const nameResponse = contact.find(q => q.question.includes('name'))?.answer || name
        const emailResponse = contact.find(q => q.question.includes('email'))?.answer || ''
        const phoneResponse = contact.find(q => q.question.includes('phone'))?.answer || ''
        const locationResponse = contact.find(q => q.question.includes('location'))?.answer || ''

        // Name - Large and bold
        this.doc.setFontSize(20)
        this.doc.setFont('helvetica', 'bold')
        this.doc.text(nameResponse, this.leftMargin, this.currentY)
        this.currentY += 10

        // Contact information
        this.doc.setFontSize(10)
        this.doc.setFont('helvetica', 'normal')

        const contactLine = [emailResponse, phoneResponse, locationResponse].filter(Boolean).join(' | ')
        this.doc.text(contactLine, this.leftMargin, this.currentY)
        this.currentY += 15

        // Add separator line
        this.doc.setDrawColor(0, 0, 0)
        this.doc.line(this.leftMargin, this.currentY, this.pageWidth - this.rightMargin, this.currentY)
        this.currentY += 10
    }

    private addSection(title: string, content: string | string[]) {
        this.checkPageBreak()

        // Section title
        this.doc.setFontSize(14)
        this.doc.setFont('helvetica', 'bold')
        this.doc.text(title.toUpperCase(), this.leftMargin, this.currentY)
        this.currentY += 8

        // Content
        this.doc.setFontSize(11)
        this.doc.setFont('helvetica', 'normal')

        if (Array.isArray(content)) {
            content.forEach(item => {
                if (item.trim()) {
                    this.addWrappedText(`• ${item}`, this.leftMargin + 5)
                    this.currentY += 2
                }
            })
        } else {
            this.addWrappedText(content, this.leftMargin)
        }

        this.currentY += 8
    }

    private addWrappedText(text: string, x: number) {
        const maxWidth = this.pageWidth - this.rightMargin - x
        const lines = this.doc.splitTextToSize(text, maxWidth)

        lines.forEach((line: string) => {
            this.checkPageBreak()
            this.doc.text(line, x, this.currentY)
            this.currentY += 5
        })
    }

    private checkPageBreak() {
        if (this.currentY > this.pageHeight) {
            this.doc.addPage()
            this.currentY = 20
        }
    }

    generateResumePDF(resumeContent: string, userProfile: QuestionnaireResponse[], jobTitle?: string): Blob {
        // Parse resume content to extract sections
        const sections = this.parseResumeContent(resumeContent)

        // Add header with contact information
        this.addHeader(jobTitle || 'Resume', userProfile)

        // Add professional summary if available
        const summary = userProfile.find(q => q.question.includes('background') || q.question.includes('summary'))?.answer
        if (summary) {
            this.addSection('Professional Summary', summary)
        }

        // Add experience section
        const experience = userProfile.find(q => q.question.includes('experience') && q.question.includes('years'))?.answer
        const currentPosition = userProfile.find(q => q.question.includes('current') && q.question.includes('position'))?.answer

        if (experience || currentPosition) {
            const experienceContent = []
            if (currentPosition) experienceContent.push(`Current Position: ${currentPosition}`)
            if (experience) experienceContent.push(`Years of Experience: ${experience}`)

            this.addSection('Professional Experience', experienceContent)
        }

        // Add technical skills
        const techSkills = this.extractTechnicalSkills(userProfile)
        if (techSkills.length > 0) {
            this.addSection('Technical Skills', techSkills)
        }

        // Add education
        const education = userProfile.find(q => q.question.includes('education'))?.answer
        const fieldOfStudy = userProfile.find(q => q.question.includes('field') && q.question.includes('study'))?.answer

        if (education || fieldOfStudy) {
            const educationContent = []
            if (education) educationContent.push(`Education Level: ${education}`)
            if (fieldOfStudy) educationContent.push(`Field of Study: ${fieldOfStudy}`)

            this.addSection('Education', educationContent)
        }

        // Add languages
        const languages = userProfile.find(q => q.question.includes('languages'))?.answer
        if (languages) {
            this.addSection('Languages', languages)
        }

        // Add certifications
        const certifications = userProfile.find(q => q.question.includes('certifications'))?.answer
        if (certifications) {
            this.addSection('Certifications', certifications)
        }

        return this.doc.output('blob')
    }

    generateCoverLetterPDF(coverLetterContent: string, userProfile: QuestionnaireResponse[], jobPosting?: JobPosting): Blob {
        // Add header
        this.addHeader('Cover Letter', userProfile)

        // Add date
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        this.doc.setFontSize(11)
        this.doc.text(today, this.leftMargin, this.currentY)
        this.currentY += 15

        // Add employer info if available
        if (jobPosting?.company) {
            this.doc.text(`${jobPosting.company}`, this.leftMargin, this.currentY)
            this.currentY += 5
            if (jobPosting.location) {
                this.doc.text(jobPosting.location, this.leftMargin, this.currentY)
                this.currentY += 10
            }
        }

        // Add subject line
        if (jobPosting?.title) {
            this.doc.setFont('helvetica', 'bold')
            this.doc.text(`Re: Application for ${jobPosting.title}`, this.leftMargin, this.currentY)
            this.currentY += 15
        }

        // Add cover letter content
        this.doc.setFont('helvetica', 'normal')
        this.addWrappedText(coverLetterContent, this.leftMargin)

        return this.doc.output('blob')
    }

    private parseResumeContent(content: string): Record<string, string[]> {
        // Simple parsing of markdown-like resume content
        const sections: Record<string, string[]> = {}
        const lines = content.split('\n')
        let currentSection = ''

        lines.forEach(line => {
            if (line.startsWith('##') || line.startsWith('#')) {
                currentSection = line.replace(/#+\s*/, '').trim()
                sections[currentSection] = []
            } else if (line.trim() && currentSection) {
                sections[currentSection].push(line.trim())
            }
        })

        return sections
    }

    private extractTechnicalSkills(userProfile: QuestionnaireResponse[]): string[] {
        const skills = []

        const programmingLangs = userProfile.find(q => q.question.includes('programming'))?.answer
        if (programmingLangs) skills.push(`Programming Languages: ${programmingLangs}`)

        const frameworks = userProfile.find(q => q.question.includes('frameworks'))?.answer
        if (frameworks) skills.push(`Frameworks/Libraries: ${frameworks}`)

        const databases = userProfile.find(q => q.question.includes('databases'))?.answer
        if (databases) skills.push(`Databases: ${databases}`)

        const tools = userProfile.find(q => q.question.includes('tools'))?.answer
        if (tools) skills.push(`Development Tools: ${tools}`)

        return skills
    }

    downloadPDF(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
}

// Export utility functions
export const generateResumePDF = (
    resumeContent: string,
    userProfile: QuestionnaireResponse[],
    options?: PDFOptions,
    jobTitle?: string
): Blob => {
    const generator = new PDFGenerator(options)
    return generator.generateResumePDF(resumeContent, userProfile, jobTitle)
}

export const generateCoverLetterPDF = (
    coverLetterContent: string,
    userProfile: QuestionnaireResponse[],
    jobPosting?: JobPosting,
    options?: PDFOptions
): Blob => {
    const generator = new PDFGenerator(options)
    return generator.generateCoverLetterPDF(coverLetterContent, userProfile, jobPosting)
}

export const downloadPDF = (blob: Blob, filename: string) => {
    const generator = new PDFGenerator()
    generator.downloadPDF(blob, filename)
}
