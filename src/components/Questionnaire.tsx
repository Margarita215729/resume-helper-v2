'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useApp } from '@/context/AppContext'
import { ParsedResumeData } from '@/lib/resume-parser'
import { QuestionnaireResponse } from '@/types/resume'
import { useState } from 'react'
import ResumeUploader from './ResumeUploader'

interface Question {
    id: string
    category: string
    question: string
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'rating'
    options?: string[]
    weight: number
    required: boolean
}

const questionnaireData: Question[] = [
    // Personal Information
    { id: 'name', category: 'Personal', question: 'What is your full name?', type: 'text', weight: 1, required: true },
    { id: 'email', category: 'Personal', question: 'What is your email address?', type: 'text', weight: 1, required: true },
    { id: 'phone', category: 'Personal', question: 'What is your phone number?', type: 'text', weight: 1, required: true },
    { id: 'location', category: 'Personal', question: 'Where are you located?', type: 'text', weight: 1, required: true },

    // Professional Experience
    { id: 'experience_years', category: 'Experience', question: 'How many years of professional experience do you have?', type: 'number', weight: 3, required: true },
    { id: 'current_position', category: 'Experience', question: 'What is your current job title?', type: 'text', weight: 2, required: false },
    { id: 'career_summary', category: 'Experience', question: 'Describe your professional background in 2-3 sentences', type: 'textarea', weight: 3, required: true },

    // Technical Skills
    { id: 'programming_languages', category: 'Technical Skills', question: 'What programming languages do you know? (comma-separated)', type: 'text', weight: 3, required: false },
    { id: 'frameworks', category: 'Technical Skills', question: 'What frameworks/libraries have you worked with?', type: 'text', weight: 2, required: false },
    { id: 'databases', category: 'Technical Skills', question: 'What databases have you worked with?', type: 'text', weight: 2, required: false },
    { id: 'tools', category: 'Technical Skills', question: 'What development tools do you use regularly?', type: 'text', weight: 2, required: false },

    // Soft Skills
    { id: 'leadership', category: 'Soft Skills', question: 'Do you have leadership experience? Describe it.', type: 'textarea', weight: 2, required: false },
    { id: 'communication', category: 'Soft Skills', question: 'Rate your communication skills (1-10)', type: 'rating', weight: 2, required: false },
    { id: 'teamwork', category: 'Soft Skills', question: 'Describe your experience working in teams', type: 'textarea', weight: 2, required: false },

    // Languages
    { id: 'languages', category: 'Languages', question: 'What languages do you speak and at what level?', type: 'textarea', weight: 2, required: false },

    // Education
    { id: 'education_level', category: 'Education', question: 'What is your highest level of education?', type: 'select', options: ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Certification'], weight: 2, required: true },
    { id: 'field_of_study', category: 'Education', question: 'What was your field of study?', type: 'text', weight: 2, required: false },

    // Work Preferences
    { id: 'work_type', category: 'Preferences', question: 'What type of work are you looking for?', type: 'multiselect', options: ['Remote', 'Hybrid', 'On-site', 'Contract', 'Full-time', 'Part-time'], weight: 1, required: false },
    { id: 'industries', category: 'Preferences', question: 'What industries interest you?', type: 'text', weight: 1, required: false },

    // Additional Skills
    { id: 'certifications', category: 'Certifications', question: 'Do you have any professional certifications?', type: 'textarea', weight: 2, required: false },
    { id: 'projects', category: 'Projects', question: 'Describe your most significant projects', type: 'textarea', weight: 3, required: false },
    { id: 'achievements', category: 'Achievements', question: 'What are your key professional achievements?', type: 'textarea', weight: 3, required: false },

    // Hospitality/Service Skills
    { id: 'customer_service', category: 'Service Skills', question: 'Do you have customer service experience?', type: 'textarea', weight: 2, required: false },
    { id: 'hospitality', category: 'Service Skills', question: 'Do you have experience in hospitality or hosting?', type: 'textarea', weight: 2, required: false },

    // Manual/Physical Work
    { id: 'physical_work', category: 'Physical Skills', question: 'Are you comfortable with physical/manual work?', type: 'select', options: ['Yes, prefer it', 'Yes, comfortable', 'Neutral', 'Prefer minimal', 'No'], weight: 1, required: false },
    { id: 'cleaning_experience', category: 'Physical Skills', question: 'Do you have cleaning or maintenance experience?', type: 'textarea', weight: 1, required: false },

    // Laboratory Skills
    { id: 'lab_experience', category: 'Laboratory', question: 'Do you have laboratory experience?', type: 'textarea', weight: 2, required: false },
    { id: 'research_skills', category: 'Laboratory', question: 'Describe any research experience you have', type: 'textarea', weight: 2, required: false }
]

export default function Questionnaire() {
    const { state, dispatch } = useApp()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [isComplete, setIsComplete] = useState(false)
    const [showUploader, setShowUploader] = useState(true)
    const [uploadedData, setUploadedData] = useState<ParsedResumeData[]>([])

    const handleDataExtracted = (data: ParsedResumeData[]) => {
        setUploadedData(data)
    }

    const handleResponsesGenerated = (responses: QuestionnaireResponse[]) => {
        // Pre-fill answers from uploaded resumes
        const newAnswers: Record<string, string> = {}
        responses.forEach(response => {
            // Find matching question by text
            const matchingQuestion = questionnaireData.find(q => q.question === response.question)
            if (matchingQuestion) {
                newAnswers[matchingQuestion.id] = response.answer
                // Also dispatch to global state
                dispatch({ type: 'UPDATE_QUESTIONNAIRE', payload: response })
            }
        })
        setAnswers(prev => ({ ...prev, ...newAnswers }))
    }

    const skipUploader = () => {
        setShowUploader(false)
    }

    const currentQuestion = questionnaireData[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questionnaireData.length) * 100

    const handleAnswer = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }))

        const response: QuestionnaireResponse = {
            category: currentQuestion.category,
            question: currentQuestion.question,
            answer: value,
            weight: currentQuestion.weight
        }

        dispatch({ type: 'UPDATE_QUESTIONNAIRE', payload: response })
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < questionnaireData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            setIsComplete(true)
            dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true })
        }
    }

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const renderInput = () => {
        const currentAnswer = answers[currentQuestion.id] || ''

        switch (currentQuestion.type) {
            case 'text':
            case 'number':
                return (
                    <Input
                        type={currentQuestion.type}
                        value={currentAnswer}
                        onChange={(e) => handleAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        className="mt-4"
                    />
                )

            case 'textarea':
                return (
                    <Textarea
                        value={currentAnswer}
                        onChange={(e) => handleAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        className="mt-4"
                        rows={4}
                    />
                )

            case 'select':
                return (
                    <select
                        value={currentAnswer}
                        onChange={(e) => handleAnswer(e.target.value)}
                        className="mt-4 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="">Select an option...</option>
                        {currentQuestion.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                )

            case 'rating':
                return (
                    <div className="mt-4 flex space-x-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => handleAnswer(rating.toString())}
                                className={`w-10 h-10 rounded-full border-2 ${currentAnswer === rating.toString()
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:border-blue-600'
                                    }`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                )

            default:
                return null
        }
    }

    if (isComplete) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>🎉 Questionnaire Complete!</CardTitle>
                    <CardDescription>
                        Thank you for providing detailed information about your skills and experience.
                        You can now start creating tailored resumes for job applications.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            We collected {state.questionnaireData.length} responses across different categories.
                        </p>
                        <Button onClick={() => window.location.href = '/resume-generator'}>
                            Start Creating Resumes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Resume Upload Section - Show at the beginning */}
            {showUploader && (
                <div className="mb-8">
                    <ResumeUploader
                        onDataExtracted={handleDataExtracted}
                        onResponsesGenerated={handleResponsesGenerated}
                    />
                    <div className="mt-4 text-center">
                        <Button
                            variant="outline"
                            onClick={skipUploader}
                            className="mr-2"
                        >
                            Skip Upload & Fill Manually
                        </Button>
                        <Button
                            onClick={() => setShowUploader(false)}
                            disabled={uploadedData.length === 0}
                        >
                            Continue with {uploadedData.length} Resume(s)
                        </Button>
                    </div>
                </div>
            )}

            {/* Show questionnaire only after uploader is hidden */}
            {!showUploader && (
                <>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Question {currentQuestionIndex + 1} of {questionnaireData.length}
                            </CardTitle>
                            <CardDescription>
                                Category: {currentQuestion.category}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {currentQuestion.question}
                                </h3>

                                {renderInput()}

                                <div className="flex justify-between pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={previousQuestion}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        onClick={nextQuestion}
                                        disabled={currentQuestion.required && !answers[currentQuestion.id]}
                                    >
                                        {currentQuestionIndex === questionnaireData.length - 1 ? 'Complete' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Question Navigation */}
                    <div className="text-center text-sm text-gray-500">
                        {currentQuestionIndex + 1} / {questionnaireData.length} questions completed
                    </div>
                </>
            )}
        </div>
    )
}
