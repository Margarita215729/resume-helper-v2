'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppProvider } from '@/context/AppContext'
import Link from 'next/link'

export default function Home() {
    return (
        <AppProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <header className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Resume Helper 🚀
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            AI-powered resume generator that creates personalized resumes and cover letters
                            for every job application. Never forget your skills again!
                        </p>
                    </header>

                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader className="text-center pb-8">
                                <CardTitle className="text-2xl md:text-3xl text-gray-900">
                                    How It Works
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    Simple 3-step process to create perfect resumes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl text-white">📝</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">1. Complete Profile</h3>
                                        <p className="text-gray-600">
                                            Answer comprehensive questions about your skills, experience, and preferences
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl text-white">🤖</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                                        <p className="text-gray-600">
                                            Paste any job posting and our AI will analyze requirements and match your skills
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl text-white">📄</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">3. Get Results</h3>
                                        <p className="text-gray-600">
                                            Receive a tailored resume and cover letter optimized for each specific job
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">🎯</span>
                                    Smart Matching
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Our AI matches your skills with job requirements to highlight the most relevant experience
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">⚡</span>
                                    Lightning Fast
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Generate professional resumes in seconds, not hours. Apply to more jobs faster
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">🌍</span>
                                    Multi-Industry
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Perfect for diverse career paths: tech, hospitality, cleaning, laboratory work, and more
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">💌</span>
                                    Cover Letters
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Auto-generated personalized cover letters for each application
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">📱</span>
                                    Mobile Friendly
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Works perfectly on all devices. Create resumes on the go
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">🎨</span>
                                    Professional Design
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Beautiful, ATS-friendly templates that get noticed by recruiters
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                            <CardContent className="pt-8">
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    Ready to Get Your Dream Job?
                                </h2>
                                <p className="text-blue-100 mb-6">
                                    Start building your comprehensive profile now and never struggle with resume writing again
                                </p>
                                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                                    <Link href="/questionnaire">
                                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                            Start Questionnaire
                                        </Button>
                                    </Link>
                                    <Link href="/resume-generator">
                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                                            Try Generator
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppProvider>
    )
}
