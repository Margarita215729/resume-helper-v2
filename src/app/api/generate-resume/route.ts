import { aiService } from '@/lib/ai-service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { jobPostingText, userProfile } = await request.json()

        if (!jobPostingText) {
            return NextResponse.json(
                { error: 'Job posting text is required' },
                { status: 400 }
            )
        }

        if (!userProfile || !Array.isArray(userProfile)) {
            return NextResponse.json(
                { error: 'User profile data is required' },
                { status: 400 }
            )
        }

        // Analyze job posting
        const jobAnalysis = await aiService.analyzeJobPosting(jobPostingText)

        // Generate tailored resume
        const tailoredResume = await aiService.generateTailoredResume(
            jobAnalysis,
            userProfile
        )

        // Generate cover letter
        const coverLetter = await aiService.generateCoverLetter(
            jobAnalysis,
            userProfile
        )

        return NextResponse.json({
            success: true,
            data: {
                jobAnalysis,
                tailoredResume,
                coverLetter
            }
        })

    } catch (error) {
        console.error('AI Generation Error:', error)

        return NextResponse.json(
            {
                error: 'Failed to generate resume and cover letter',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
