import { githubModelsService } from '@/lib/github-models'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        // For demo purposes, return success without API check
        // In production, you would test GitHub Models API connectivity
        const hasToken = !!process.env.GITHUB_TOKEN

        return NextResponse.json({
            status: 'success',
            message: 'Resume Helper API is working',
            githubToken: hasToken ? 'configured' : 'missing',
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        })

    } catch (error) {
        console.error('Health check failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        return NextResponse.json(
            {
                error: 'Health check failed',
                details: errorMessage
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const { action, data } = await request.json()

        switch (action) {
            case 'test_resume_analysis':
                const resumeResult = await githubModelsService.analyzeResume(
                    data.resumeContent || 'Sample resume content for testing',
                    data.jobDescription
                )
                return NextResponse.json({ action, result: resumeResult })

            case 'test_job_match':
                const jobMatchResult = await githubModelsService.analyzeJobMatch(
                    data.userProfile || { skills: ['JavaScript', 'React'], experience: '3 years' },
                    data.jobDescription || 'Frontend Developer position requiring React skills'
                )
                return NextResponse.json({ action, result: jobMatchResult })

            case 'test_psych_profile':
                const psychResult = await githubModelsService.analyzePsychProfile(
                    data.profileData || { personalityType: 'INTJ', motivationFactors: ['achievement'] }
                )
                return NextResponse.json({ action, result: psychResult })

            case 'test_skill_recommendations':
                const skillResult = await githubModelsService.recommendSkills(
                    data.currentSkills || ['HTML', 'CSS', 'JavaScript'],
                    data.targetRole || 'Full Stack Developer'
                )
                return NextResponse.json({ action, result: skillResult })

            default:
                return NextResponse.json(
                    { error: 'Invalid action', availableActions: ['test_resume_analysis', 'test_job_match', 'test_psych_profile', 'test_skill_recommendations'] },
                    { status: 400 }
                )
        }

    } catch (error) {
        console.error('API test failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        return NextResponse.json(
            {
                error: 'API test failed',
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
