'use client'

import { Button } from '@/components/ui/button'
import { downloadPDF, generateCoverLetterPDF, generateResumePDF } from '@/lib/pdf-generator'
import { JobPosting, QuestionnaireResponse } from '@/types/resume'
import { useState } from 'react'

interface PDFExportButtonProps {
    type: 'resume' | 'cover-letter'
    content: string
    userProfile: QuestionnaireResponse[]
    jobPosting?: JobPosting
    className?: string
}

export default function PDFExportButton({
    type,
    content,
    userProfile,
    jobPosting,
    className = ''
}: PDFExportButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleExport = async () => {
        if (!content.trim()) {
            setError(`Please generate ${type} first`)
            return
        }

        setIsGenerating(true)
        setError(null)

        try {
            let pdfBlob: Blob
            let filename: string

            if (type === 'resume') {
                pdfBlob = generateResumePDF(
                    content,
                    userProfile,
                    { template: 'classic', fontSize: 'medium', colorScheme: 'black-white' },
                    jobPosting?.title
                )
                filename = `Resume_${jobPosting?.title?.replace(/\s+/g, '_') || 'Generated'}_${new Date().toISOString().split('T')[0]}.pdf`
            } else {
                pdfBlob = generateCoverLetterPDF(
                    content,
                    userProfile,
                    jobPosting,
                    { template: 'classic', fontSize: 'medium', colorScheme: 'black-white' }
                )
                filename = `CoverLetter_${jobPosting?.title?.replace(/\s+/g, '_') || 'Generated'}_${new Date().toISOString().split('T')[0]}.pdf`
            }

            downloadPDF(pdfBlob, filename)

            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            console.error('PDF generation error:', error)
            setError('Failed to generate PDF. Please try again.')
            setTimeout(() => setError(null), 5000)
        } finally {
            setIsGenerating(false)
        }
    }

    const buttonText = () => {
        if (isGenerating) return 'Generating PDF...'
        if (success) return '✅ PDF Downloaded!'
        if (type === 'resume') return '📄 Download Resume PDF'
        return '💌 Download Cover Letter PDF'
    }

    return (
        <div className="space-y-2">
            <Button
                onClick={handleExport}
                disabled={isGenerating || !content.trim()}
                className={className}
            >
                {buttonText()}
            </Button>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}
        </div>
    )
}
