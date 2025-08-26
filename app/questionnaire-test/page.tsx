'use client'

import Navigation from '@/components/Navigation'
import Questionnaire from '@/components/Questionnaire'
import { AppProvider } from '@/context/AppContext'

export default function QuestionnaireTestPage() {
    return (
        <AppProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Navigation />

                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Enhanced Profile Builder
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Upload your existing resumes to automatically extract and populate your profile information,
                            or fill out the comprehensive questionnaire manually.
                        </p>
                    </div>

                    <Questionnaire />
                </div>
            </div>
        </AppProvider>
    )
}
