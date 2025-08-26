'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useApp } from '@/context/AppContext'
import { PDFGenerator, PDFOptions } from '@/lib/pdf-generator'
import { saveDocument } from '@/lib/storage'
import { JobPosting, QuestionnaireResponse } from '@/types/resume'
import { useState } from 'react'

export default function ResumeGenerator() {
    const { state } = useApp()
    const [jobPostingText, setJobPostingText] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analyzedJob, setAnalyzedJob] = useState<JobPosting | null>(null)
    const [generatedResume, setGeneratedResume] = useState<string | null>(null)
    const [coverLetter, setCoverLetter] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [copySuccess, setCopySuccess] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState<string | null>(null)
    const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
        template: 'classic',
        fontSize: 'medium',
        colorScheme: 'black-white'
    })

    const copyToClipboard = async (text: string, type: 'resume' | 'cover-letter') => {
        try {
            await navigator.clipboard.writeText(text)
            setCopySuccess(type)
            setTimeout(() => setCopySuccess(null), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const analyzeJobPosting = async () => {
        if (!jobPostingText.trim()) {
            setError('Please enter a job posting text')
            return
        }

        setIsAnalyzing(true)
        setError(null)
        setSuccess(false)

        try {
            // Real AI analysis using GitHub Models API
            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobPostingText,
                    userProfile: state.questionnaireData
                }),
            })

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                // Set analyzed job data
                const jobData: JobPosting = {
                    title: result.data.jobAnalysis.title,
                    company: companyName || result.data.jobAnalysis.company,
                    description: jobPostingText,
                    requirements: result.data.jobAnalysis.requirements || [],
                    preferredSkills: result.data.jobAnalysis.skills || [],
                    location: result.data.jobAnalysis.location
                }

                setAnalyzedJob(jobData)
                setGeneratedResume(result.data.tailoredResume)
                setCoverLetter(result.data.coverLetter)
                setSuccess(true)
            } else {
                throw new Error(result.error || 'Failed to analyze job posting')
            }

        } catch (error) {
            console.error('Error analyzing job posting:', error)
            setError('AI service temporarily unavailable. Using fallback analysis.')

            // Fallback to mock analysis if AI fails
            const mockAnalysis: JobPosting = {
                title: extractJobTitle(jobPostingText),
                company: companyName || extractCompanyName(jobPostingText),
                description: jobPostingText,
                requirements: extractRequirements(jobPostingText),
                preferredSkills: extractSkills(jobPostingText),
                location: extractLocation(jobPostingText)
            }

            setAnalyzedJob(mockAnalysis)

            // Generate tailored resume based on user's questionnaire data and job requirements
            const tailoredResume = generateTailoredResume(mockAnalysis, state.questionnaireData)
            setGeneratedResume(tailoredResume)

            // Generate cover letter
            const coverLetterText = generateCoverLetter(mockAnalysis, state.questionnaireData)
            setCoverLetter(coverLetterText)
            setSuccess(true)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const extractJobTitle = (text: string): string => {
        // Simple extraction logic - в реальном приложении будет более сложная логика
        const lines = text.split('\n')
        return lines[0] || 'Position'
    }

    const extractCompanyName = (text: string): string => {
        // Simple extraction logic
        const companyMatch = text.match(/at\s+([A-Z][a-zA-Z\s&]+)/i)
        return companyMatch?.[1] || 'Company'
    }

    const extractRequirements = (text: string): string[] => {
        const requirements: string[] = []
        const lowerText = text.toLowerCase()

        if (lowerText.includes('experience')) requirements.push('Professional experience required')
        if (lowerText.includes('bachelor')) requirements.push('Bachelor\'s degree preferred')
        if (lowerText.includes('team')) requirements.push('Team collaboration skills')
        if (lowerText.includes('communication')) requirements.push('Strong communication skills')

        return requirements
    }

    const extractSkills = (text: string): string[] => {
        const skills: string[] = []
        const lowerText = text.toLowerCase()

        // Programming languages
        const programmingLanguages = ['javascript', 'python', 'java', 'react', 'node.js', 'typescript', 'html', 'css']
        programmingLanguages.forEach(lang => {
            if (lowerText.includes(lang)) skills.push(lang)
        })

        // Soft skills
        if (lowerText.includes('leadership')) skills.push('Leadership')
        if (lowerText.includes('project management')) skills.push('Project Management')
        if (lowerText.includes('customer service')) skills.push('Customer Service')
        if (lowerText.includes('cleaning')) skills.push('Cleaning')
        if (lowerText.includes('host')) skills.push('Hospitality')

        return skills
    }

    const extractLocation = (text: string): string => {
        const locationMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/i)
        return locationMatch?.[0] || 'Location not specified'
    }

    const generateTailoredResume = (job: JobPosting, questionnaireData: QuestionnaireResponse[]): string => {
        // Match user's skills with job requirements
        const relevantSkills = questionnaireData
            .filter(q => q.category === 'Technical Skills' || q.category === 'Soft Skills')
            .map(q => q.answer)
            .join(', ')

        const experience = questionnaireData.find(q => q.question.includes('professional background'))?.answer || ''
        const name = questionnaireData.find(q => q.question.includes('full name'))?.answer || 'Your Name'

        return `# ${name}

## Professional Summary
${experience}

## Key Skills Relevant to ${job.title}
${relevantSkills}

## Experience
[Tailored based on job requirements]

## Education
[Your education details]

## Languages
[Your language skills]

*This resume has been tailored specifically for the ${job.title} position at ${job.company}*`
    }

    const generateCoverLetter = (job: JobPosting, questionnaireData: QuestionnaireResponse[]): string => {
        const name = questionnaireData.find(q => q.question.includes('full name'))?.answer || 'Your Name'
        const experience = questionnaireData.find(q => q.question.includes('professional background'))?.answer || ''

        return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. 

${experience}

Based on the job requirements, I believe my skills and experience make me an excellent candidate for this role. I am particularly excited about the opportunity to contribute to your team and would welcome the chance to discuss how my background aligns with your needs.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
${name}`
    }

    const exportToPDF = async (type: 'resume' | 'cover-letter') => {
        if (!analyzedJob || (!generatedResume && !coverLetter)) {
            setError('No content available for export')
            return
        }

        setIsExporting(type)
        setError(null)

        try {
            const pdfGenerator = new PDFGenerator(pdfOptions)
            const name = state.questionnaireData.find(q => q.question.includes('full name'))?.answer || 'Your Name'

            let filename: string
            let pdfBlob: Blob

            if (type === 'resume' && generatedResume) {
                // Generate resume PDF
                pdfBlob = pdfGenerator.generateResumePDF(generatedResume, state.questionnaireData, analyzedJob.title)
                filename = `${name.replace(/\s+/g, '_')}_Resume_${analyzedJob.company.replace(/\s+/g, '_')}.pdf`

                // Save to localStorage if profile exists
                if (state.currentProfile) {
                    saveDocument({
                        type: 'resume',
                        title: `Resume for ${analyzedJob.title}`,
                        content: generatedResume,
                        jobTitle: analyzedJob.title,
                        company: analyzedJob.company,
                        profileId: state.currentProfile.id
                    })
                }
            } else if (type === 'cover-letter' && coverLetter) {
                // Generate cover letter PDF
                pdfBlob = pdfGenerator.generateCoverLetterPDF(coverLetter, state.questionnaireData, analyzedJob)
                filename = `${name.replace(/\s+/g, '_')}_CoverLetter_${analyzedJob.company.replace(/\s+/g, '_')}.pdf`

                // Save to localStorage if profile exists
                if (state.currentProfile) {
                    saveDocument({
                        type: 'cover-letter',
                        title: `Cover Letter for ${analyzedJob.title}`,
                        content: coverLetter,
                        jobTitle: analyzedJob.title,
                        company: analyzedJob.company,
                        profileId: state.currentProfile.id
                    })
                }
            } else {
                throw new Error('Invalid export type or missing content')
            }

            // Download the PDF
            pdfGenerator.downloadPDF(pdfBlob, filename)

            // Show success message
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)

        } catch (error) {
            console.error('PDF export error:', error)
            setError('Failed to export PDF. Please try again.')
        } finally {
            setIsExporting(null)
        }
    }

    if (!state.isOnboardingComplete) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Complete Your Profile First</CardTitle>
                    <CardDescription>
                        Please complete the questionnaire before generating resumes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => window.location.href = '/questionnaire'}>
                        Go to Questionnaire
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>🚀 AI-Powered Resume Generator</CardTitle>
                    <CardDescription>
                        Paste a job posting and we&apos;ll create a tailored resume and cover letter for you
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name (optional)
                        </label>
                        <Input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter company name..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Posting Text *
                        </label>
                        <Textarea
                            value={jobPostingText}
                            onChange={(e) => setJobPostingText(e.target.value)}
                            placeholder="Paste the complete job posting here..."
                            rows={10}
                        />
                    </div>

                    <Button
                        onClick={analyzeJobPosting}
                        disabled={!jobPostingText.trim() || isAnalyzing}
                        className="w-full"
                    >
                        {isAnalyzing ? 'Analyzing Job Posting...' : 'Generate Tailored Resume & Cover Letter'}
                    </Button>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-red-500">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-green-500">✅</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        Resume and cover letter generated successfully!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {analyzedJob && (
                <Card>
                    <CardHeader>
                        <CardTitle>📊 Job Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-900">Position:</h4>
                                <p className="text-gray-600">{analyzedJob.title}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Company:</h4>
                                <p className="text-gray-600">{analyzedJob.company}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Location:</h4>
                                <p className="text-gray-600">{analyzedJob.location}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Key Skills:</h4>
                                <p className="text-gray-600">{analyzedJob.preferredSkills.join(', ')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {(generatedResume || coverLetter) && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>🎨 PDF Export Options</CardTitle>
                        <CardDescription>
                            Customize your PDF appearance before downloading
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template
                                </label>
                                <select
                                    value={pdfOptions.template}
                                    onChange={(e) => setPdfOptions(prev => ({
                                        ...prev,
                                        template: e.target.value as PDFOptions['template']
                                    }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="classic">📄 Classic</option>
                                    <option value="modern">✨ Modern</option>
                                    <option value="ats-optimized">🤖 ATS-Optimized</option>
                                    <option value="creative">🎨 Creative</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Font Size
                                </label>
                                <select
                                    value={pdfOptions.fontSize}
                                    onChange={(e) => setPdfOptions(prev => ({
                                        ...prev,
                                        fontSize: e.target.value as PDFOptions['fontSize']
                                    }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="small">Small (10pt)</option>
                                    <option value="medium">Medium (12pt)</option>
                                    <option value="large">Large (14pt)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color Scheme
                                </label>
                                <select
                                    value={pdfOptions.colorScheme}
                                    onChange={(e) => setPdfOptions(prev => ({
                                        ...prev,
                                        colorScheme: e.target.value as PDFOptions['colorScheme']
                                    }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="black-white">⚫ Black & White</option>
                                    <option value="blue-accent">🔵 Blue Accent</option>
                                    <option value="professional">💼 Professional</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {generatedResume && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>📄 Tailored Resume</CardTitle>
                            <CardDescription>
                                Optimized for {analyzedJob?.title} at {analyzedJob?.company}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap text-sm">{generatedResume}</pre>
                            </div>
                            <div className="mt-4 space-x-2">
                                <Button
                                    onClick={() => exportToPDF('resume')}
                                    disabled={isExporting === 'resume'}
                                >
                                    {isExporting === 'resume' ? 'Generating PDF...' : '📄 Download PDF'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(generatedResume!, 'resume')}
                                >
                                    {copySuccess === 'resume' ? '✅ Copied!' : '📋 Copy Resume'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>💌 Cover Letter</CardTitle>
                            <CardDescription>
                                Personalized for this specific opportunity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap text-sm">{coverLetter}</pre>
                            </div>
                            <div className="mt-4 space-x-2">
                                <Button
                                    onClick={() => exportToPDF('cover-letter')}
                                    disabled={isExporting === 'cover-letter'}
                                >
                                    {isExporting === 'cover-letter' ? 'Generating PDF...' : '📄 Download PDF'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(coverLetter!, 'cover-letter')}
                                >
                                    {copySuccess === 'cover-letter' ? '✅ Copied!' : '📋 Copy Letter'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
