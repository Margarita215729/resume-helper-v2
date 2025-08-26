'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ResumeParser, { ParsedResumeData } from '@/lib/resume-parser'
import { QuestionnaireResponse } from '@/types/resume'
import { AlertCircle, Check, Download, FileText, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'

interface UploadedResume {
    id: string
    filename: string
    uploadDate: Date
    parsedData: ParsedResumeData
    rawText: string
}

interface ResumeUploaderProps {
    onDataExtracted: (data: ParsedResumeData[]) => void
    onResponsesGenerated: (responses: QuestionnaireResponse[]) => void
}

export default function ResumeUploader({ onDataExtracted, onResponsesGenerated }: ResumeUploaderProps) {
    const [uploadedResumes, setUploadedResumes] = useState<UploadedResume[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingFile, setProcessingFile] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const parser = ResumeParser.getInstance()

    const handleFileUpload = useCallback(async (files: FileList | File[]) => {
        setError(null)
        const fileArray = Array.from(files)

        for (const file of fileArray) {
            if (!file.type.includes('pdf') &&
                !file.type.includes('doc') &&
                !file.type.includes('text') &&
                !file.name.toLowerCase().endsWith('.txt')) {
                setError(`Unsupported file type: ${file.name}. Please upload PDF, DOC, DOCX, or TXT files.`)
                continue
            }

            setIsProcessing(true)
            setProcessingFile(file.name)

            try {
                const parsedData = await parser.parseFile(file)
                const newResume: UploadedResume = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    filename: file.name,
                    uploadDate: new Date(),
                    parsedData,
                    rawText: await file.text()
                }

                setUploadedResumes(prev => [...prev, newResume])

                // Auto-generate questionnaire responses from parsed data
                const generatedResponses = generateQuestionnaireResponses(parsedData)
                onResponsesGenerated(generatedResponses)

            } catch (err) {
                setError(`Failed to parse ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
            }
        }

        setIsProcessing(false)
        setProcessingFile(null)
    }, [parser, onResponsesGenerated])

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files)
        }
    }, [handleFileUpload])

    const removeResume = (id: string) => {
        setUploadedResumes(prev => prev.filter(resume => resume.id !== id))

        // Update data extraction
        const remainingData = uploadedResumes
            .filter(resume => resume.id !== id)
            .map(resume => resume.parsedData)
        onDataExtracted(remainingData)
    }

    const exportParsedData = (resume: UploadedResume) => {
        const dataStr = JSON.stringify(resume.parsedData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${resume.filename.replace(/\.[^/.]+$/, '')}_parsed.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    // Auto-trigger data extraction when resumes change
    useState(() => {
        onDataExtracted(uploadedResumes.map(resume => resume.parsedData))
    })

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Previous Resumes
                    </CardTitle>
                    <CardDescription>
                        Upload your existing resumes (PDF, DOC, DOCX, TXT) to automatically extract and populate your profile information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Drop your resume files here
                        </h3>
                        <p className="text-gray-500 mb-4">
                            or click to browse files
                        </p>
                        <Input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload">
                            <Button variant="outline" className="cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" />
                                Select Files
                            </Button>
                        </label>

                        {isProcessing && (
                            <div className="mt-4 text-sm text-blue-600">
                                Processing {processingFile}...
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Uploaded Resumes List */}
            {uploadedResumes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Uploaded Resumes ({uploadedResumes.length})
                        </CardTitle>
                        <CardDescription>
                            Data has been extracted from these resumes and used to pre-fill your questionnaire
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {uploadedResumes.map((resume) => (
                                <div key={resume.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{resume.filename}</h4>
                                            <p className="text-sm text-gray-500">
                                                Uploaded {resume.uploadDate.toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => exportParsedData(resume)}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Export Data
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeResume(resume.id)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Extracted Data Preview */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <strong>Personal Info:</strong>
                                            <ul className="mt-1 text-gray-600">
                                                {resume.parsedData.personalInfo.name && (
                                                    <li>• {resume.parsedData.personalInfo.name}</li>
                                                )}
                                                {resume.parsedData.personalInfo.email && (
                                                    <li>• {resume.parsedData.personalInfo.email}</li>
                                                )}
                                                {resume.parsedData.personalInfo.phone && (
                                                    <li>• {resume.parsedData.personalInfo.phone}</li>
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <strong>Experience:</strong>
                                            <ul className="mt-1 text-gray-600">
                                                {resume.parsedData.experience.slice(0, 3).map((exp, idx) => (
                                                    <li key={idx}>• {exp.title} at {exp.company}</li>
                                                ))}
                                                {resume.parsedData.experience.length > 3 && (
                                                    <li>• +{resume.parsedData.experience.length - 3} more...</li>
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <strong>Skills:</strong>
                                            <ul className="mt-1 text-gray-600">
                                                {resume.parsedData.skills.technical.slice(0, 5).map((skill, idx) => (
                                                    <li key={idx}>• {skill}</li>
                                                ))}
                                                {resume.parsedData.skills.technical.length > 5 && (
                                                    <li>• +{resume.parsedData.skills.technical.length - 5} more...</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Data Integration Status */}
            {uploadedResumes.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-green-700">
                            <Check className="w-5 h-5" />
                            <span className="font-medium">
                                Data successfully extracted and integrated!
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-green-600">
                            Your questionnaire has been pre-filled with information from {uploadedResumes.length} resume(s).
                            You can review and edit the information in the questionnaire sections below.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

// Helper function to convert parsed resume data to questionnaire responses
function generateQuestionnaireResponses(parsedData: ParsedResumeData): QuestionnaireResponse[] {
    const responses: QuestionnaireResponse[] = []

    // Personal Information
    if (parsedData.personalInfo.name) {
        responses.push({
            question: 'What is your full name?',
            answer: parsedData.personalInfo.name,
            category: 'Personal',
            weight: 1
        })
    }
    if (parsedData.personalInfo.email) {
        responses.push({
            question: 'What is your email address?',
            answer: parsedData.personalInfo.email,
            category: 'Personal',
            weight: 1
        })
    }
    if (parsedData.personalInfo.phone) {
        responses.push({
            question: 'What is your phone number?',
            answer: parsedData.personalInfo.phone,
            category: 'Personal',
            weight: 1
        })
    }
    if (parsedData.personalInfo.location) {
        responses.push({
            question: 'Where are you located?',
            answer: parsedData.personalInfo.location,
            category: 'Personal',
            weight: 1
        })
    }

    // Professional Experience
    if (parsedData.experience.length > 0) {
        const currentJob = parsedData.experience.find(exp => exp.current) || parsedData.experience[0]
        if (currentJob) {
            responses.push({
                question: 'What is your current job title?',
                answer: currentJob.title,
                category: 'Experience',
                weight: 2
            })
        }

        // Calculate years of experience (simplified)
        const totalYears = parsedData.experience.length * 2 // Rough estimate
        responses.push({
            question: 'How many years of professional experience do you have?',
            answer: totalYears.toString(),
            category: 'Experience',
            weight: 3
        })

        // Career summary from experience descriptions
        const summaryText = parsedData.summary ||
            parsedData.experience.slice(0, 2)
                .map(exp => `${exp.title} at ${exp.company}: ${exp.description.substring(0, 100)}...`)
                .join(' ')

        if (summaryText) {
            responses.push({
                question: 'Describe your professional background in 2-3 sentences',
                answer: summaryText,
                category: 'Experience',
                weight: 3
            })
        }
    }

    // Technical Skills
    if (parsedData.skills.technical.length > 0) {
        responses.push({
            question: 'What programming languages do you know? (comma-separated)',
            answer: parsedData.skills.technical.join(', '),
            category: 'Technical Skills',
            weight: 3
        })
    }

    // Education
    if (parsedData.education.length > 0) {
        const highestEducation = parsedData.education[0] // Assume first is highest
        responses.push({
            question: 'What is your highest level of education?',
            answer: highestEducation.degree,
            category: 'Education',
            weight: 2
        })

        if (highestEducation.institution) {
            responses.push({
                question: 'What was your field of study?',
                answer: highestEducation.institution,
                category: 'Education',
                weight: 2
            })
        }
    }

    // Languages
    if (parsedData.skills.languages.length > 0) {
        const languageText = parsedData.skills.languages
            .map(lang => `${lang.language}: ${lang.level}`)
            .join(', ')

        responses.push({
            question: 'What languages do you speak and at what level?',
            answer: languageText,
            category: 'Languages',
            weight: 2
        })
    }

    return responses
}
