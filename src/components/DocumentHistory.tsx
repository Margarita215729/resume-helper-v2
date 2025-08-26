'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import {
    deleteDocument,
    getDocuments,
    type GeneratedDocument
} from '@/lib/storage'
import { useEffect, useState } from 'react'

export default function DocumentHistory() {
    const { state } = useApp()
    const [documents, setDocuments] = useState<GeneratedDocument[]>([])
    const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null)

    useEffect(() => {
        const loadDocs = () => {
            const profileId = state.currentProfile?.id
            const allDocs = profileId ? getDocuments(profileId) : getDocuments()

            // Sort by creation date (newest first)
            const sortedDocs = allDocs.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            setDocuments(sortedDocs)
        }

        loadDocs()
    }, [state.currentProfile])

    const loadDocuments = () => {
        const profileId = state.currentProfile?.id
        const allDocs = profileId ? getDocuments(profileId) : getDocuments()

        // Sort by creation date (newest first)
        const sortedDocs = allDocs.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        setDocuments(sortedDocs)
    }

    const handleDeleteDocument = (documentId: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            deleteDocument(documentId)
            loadDocuments()
            if (selectedDocument?.id === documentId) {
                setSelectedDocument(null)
            }
        }
    }

    const downloadDocument = (doc: GeneratedDocument) => {
        const blob = new Blob([doc.content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${doc.title.replace(/\s+/g, '_')}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const groupedDocuments = documents.reduce((groups, doc) => {
        const type = doc.type
        if (!groups[type]) {
            groups[type] = []
        }
        groups[type].push(doc)
        return groups
    }, {} as Record<string, GeneratedDocument[]>)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Document History</h2>
                <div className="text-sm text-gray-500">
                    {state.currentProfile ? `Profile: ${state.currentProfile.name}` : 'All profiles'}
                </div>
            </div>

            {documents.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-500">No documents found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Generate some resumes and cover letters to see them here
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Document List */}
                    <div className="space-y-4">
                        {Object.entries(groupedDocuments).map(([type, docs]) => (
                            <Card key={type}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {type === 'resume' ? '📄' : '💌'}
                                        {type === 'resume' ? 'Resumes' : 'Cover Letters'}
                                        <span className="text-sm text-gray-500">({docs.length})</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {docs.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedDocument?.id === doc.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setSelectedDocument(doc)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm">{doc.title}</h4>
                                                        {doc.company && (
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {doc.jobTitle} at {doc.company}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(doc.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1 ml-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                downloadDocument(doc)
                                                            }}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            📥
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDeleteDocument(doc.id)
                                                            }}
                                                            className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Document Preview */}
                    <div>
                        {selectedDocument ? (
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {selectedDocument.type === 'resume' ? '📄' : '💌'}
                                        {selectedDocument.title}
                                    </CardTitle>
                                    <CardDescription>
                                        Created: {formatDate(selectedDocument.createdAt)}
                                        {selectedDocument.company && (
                                            <span className="block mt-1">
                                                {selectedDocument.jobTitle} at {selectedDocument.company}
                                            </span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                                        <pre className="whitespace-pre-wrap text-sm">
                                            {selectedDocument.content}
                                        </pre>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            onClick={() => downloadDocument(selectedDocument)}
                                            size="sm"
                                        >
                                            📥 Download as Text
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigator.clipboard.writeText(selectedDocument.content)}
                                            size="sm"
                                        >
                                            📋 Copy to Clipboard
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleDeleteDocument(selectedDocument.id)}
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 ml-auto"
                                        >
                                            🗑️ Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <p className="text-gray-500">Select a document to preview</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
