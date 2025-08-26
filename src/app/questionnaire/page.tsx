'use client'

import Questionnaire from '@/components/Questionnaire'
import { AppProvider } from '@/context/AppContext'

export default function QuestionnairePage() {
    return (
        <AppProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📝 Skills & Experience Questionnaire
                        </h1>
                        <p className="text-gray-600">
                            Help us understand your background so we can create perfect resumes for you
                        </p>
                    </div>

                    <Questionnaire />
                </div>
            </div>
        </AppProvider>
    )
}
