'use client'

import DocumentHistory from '@/components/DocumentHistory'
import { Button } from '@/components/ui/button'
import { AppProvider } from '@/context/AppContext'
import Link from 'next/link'

export default function DocumentsPage() {
    return (
        <AppProvider>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Document History</h1>
                        <Link href="/">
                            <Button variant="outline">
                                ← Back to Home
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <DocumentHistory />
                    </div>

                    <div className="mt-8 text-center">
                        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                            <Link href="/resume-generator">
                                <Button className="w-full" size="lg">
                                    📄 Generate Resume
                                </Button>
                            </Link>
                            <Link href="/profiles">
                                <Button variant="outline" className="w-full" size="lg">
                                    📁 Manage Profiles
                                </Button>
                            </Link>
                            <Link href="/pdf-test">
                                <Button variant="outline" className="w-full" size="lg">
                                    🧪 Test PDF Export
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppProvider>
    )
}
