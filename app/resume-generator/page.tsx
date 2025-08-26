'use client'

import ResumeGenerator from '@/components/ResumeGenerator'
import { AppProvider } from '@/context/AppContext'

export default function ResumeGeneratorPage() {
    return (
        <AppProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🤖 AI Resume Generator
                        </h1>
                        <p className="text-gray-600">
                            Paste a job posting and get a tailored resume and cover letter instantly
                        </p>
                    </div>

                    <ResumeGenerator />
                </div>
            </div>
        </AppProvider>
    )
}
