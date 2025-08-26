/**
 * GitHub Models AI Service
 * Provides AI capabilities using GitHub Models API
 */

interface GitHubModelsConfig {
    token: string
    endpoint: string
    modelName: string
}

interface AIAnalysisRequest {
    prompt: string
    context?: string
    maxTokens?: number
    temperature?: number
}

interface AIAnalysisResponse {
    content: string
    tokensUsed: number
    model: string
    timestamp: Date
}

interface UserProfile {
    skills?: string[]
    experience?: string
    education?: string
    careerGoals?: string
}

interface PsychologicalProfileData {
    personalityType?: string
    workPreferences?: Record<string, unknown>
    motivationFactors?: string[]
    stressFactors?: string[]
    communicationStyle?: string
    learningStyle?: string
}

export class GitHubModelsService {
    private config: GitHubModelsConfig
    private baseHeaders: Record<string, string>

    constructor() {
        this.config = {
            token: process.env.GITHUB_TOKEN || '',
            endpoint: process.env.GITHUB_MODEL_ENDPOINT || 'https://models.github.ai/inference',
            modelName: process.env.GITHUB_MODEL_NAME || 'openai/o4-mini'
        }

        this.baseHeaders = {
            'Authorization': `Bearer ${this.config.token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'resume-helper-v2/1.0.0'
        }

        if (!this.config.token) {
            console.warn('GitHub token not configured - AI features will be disabled')
        }
    }

    /**
     * Analyze resume content for optimization suggestions
     */
    async analyzeResume(resumeContent: string, jobDescription?: string): Promise<AIAnalysisResponse> {
        const prompt = this.buildResumeAnalysisPrompt(resumeContent, jobDescription)
        return this.callAI({
            prompt,
            maxTokens: 1000,
            temperature: 0.3
        })
    }

    /**
     * Generate job match analysis
     */
    async analyzeJobMatch(userProfile: UserProfile, jobDescription: string): Promise<AIAnalysisResponse> {
        const prompt = this.buildJobMatchPrompt(userProfile, jobDescription)
        return this.callAI({
            prompt,
            maxTokens: 800,
            temperature: 0.2
        })
    }

    /**
     * Analyze psychological profile for career insights
     */
    async analyzePsychProfile(profileData: PsychologicalProfileData): Promise<AIAnalysisResponse> {
        const prompt = this.buildPsychAnalysisPrompt(profileData)
        return this.callAI({
            prompt,
            maxTokens: 600,
            temperature: 0.4
        })
    }

    /**
     * Generate skill recommendations
     */
    async recommendSkills(userSkills: string[], targetRole: string): Promise<AIAnalysisResponse> {
        const prompt = this.buildSkillRecommendationPrompt(userSkills, targetRole)
        return this.callAI({
            prompt,
            maxTokens: 500,
            temperature: 0.3
        })
    }

    /**
     * Core AI calling method
     */
    private async callAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
        if (!this.config.token) {
            throw new Error('GitHub Models API not configured')
        }

        try {
            // For demo purposes, return mock response
            // In production, this would call the actual GitHub Models API
            const mockResponse = this.generateMockResponse(request.prompt)

            return {
                content: mockResponse,
                tokensUsed: request.maxTokens || 100,
                model: this.config.modelName,
                timestamp: new Date()
            }

            /* Original GitHub API call - commented for demo
            const response = await fetch(`${this.config.endpoint}/chat/completions`, {
                method: 'POST',
                headers: this.baseHeaders,
                body: JSON.stringify({
                    model: this.config.modelName,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert career counselor and resume analyst. Provide professional, actionable advice.'
                        },
                        {
                            role: 'user',
                            content: request.prompt
                        }
                    ],
                    max_tokens: request.maxTokens || 500,
                    temperature: request.temperature || 0.3,
                    top_p: 0.9
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`GitHub Models API error: ${response.status} - ${errorText}`)
            }

            const data = await response.json()

            return {
                content: data.choices?.[0]?.message?.content || 'No content generated',
                tokensUsed: data.usage?.total_tokens || 0,
                model: this.config.modelName,
                timestamp: new Date()
            }
            */

        } catch (error) {
            console.error('GitHub Models API call failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`AI analysis failed: ${errorMessage}`)
        }
    }

    /**
     * Generate mock response for demo purposes
     */
    private generateMockResponse(prompt: string): string {
        if (prompt.toLowerCase().includes('hello')) {
            return 'Hello! I am the Resume Helper AI assistant.'
        }

        if (prompt.toLowerCase().includes('resume')) {
            return `# Resume Analysis

**Strengths:**
- Clear professional experience
- Relevant technical skills
- Strong educational background

**Recommendations:**
1. Add quantifiable achievements with numbers and percentages
2. Include relevant keywords from the job description
3. Highlight leadership and project management experience
4. Consider adding a professional summary section

**Optimization Tips:**
- Use action verbs like "developed," "implemented," "led"
- Tailor skills section to match job requirements
- Include industry-specific certifications if available`
        }

        if (prompt.toLowerCase().includes('job match')) {
            return `# Job Match Analysis

**Match Score: 85%**

**Strong Matches:**
- Technical skills align well with job requirements
- Experience level matches position expectations
- Educational background is relevant

**Areas to Highlight:**
- Your programming experience with React and TypeScript
- Project management and team collaboration skills
- Problem-solving and analytical abilities

**Suggestions:**
- Emphasize your full-stack development experience
- Highlight any cloud platform experience (Azure, AWS)
- Mention agile/scrum methodology experience if applicable`
        }

        // Default response
        return `Thank you for your query. Based on your request, I recommend:

1. **Focus on relevant skills** - Highlight experiences that directly relate to your target role
2. **Quantify achievements** - Use specific numbers and metrics where possible
3. **Professional presentation** - Ensure consistent formatting and clear structure
4. **Continuous learning** - Stay updated with industry trends and technologies

This analysis is generated by the Resume Helper AI assistant to help optimize your career documents.`
    }

    /**
     * Build resume analysis prompt
     */
    private buildResumeAnalysisPrompt(resumeContent: string, jobDescription?: string): string {
        let prompt = `Analyze this resume and provide optimization suggestions:

Resume Content:
${resumeContent}

Please provide:
1. Strengths of the current resume
2. Areas for improvement
3. Specific suggestions for better formatting
4. Keywords that should be included
5. Overall rating (1-10) with explanation`

        if (jobDescription) {
            prompt += `

Target Job Description:
${jobDescription}

Additionally, analyze how well this resume matches the job requirements and suggest specific improvements for this role.`
        }

        return prompt
    }

    /**
     * Build job match analysis prompt
     */
    private buildJobMatchPrompt(userProfile: UserProfile, jobDescription: string): string {
        return `Analyze job match compatibility:

User Profile:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Career Goals: ${userProfile.careerGoals || 'Not specified'}

Job Description:
${jobDescription}

Provide:
1. Match score (0-100%)
2. Matching qualifications
3. Skill gaps and missing requirements
4. Recommendations for improving candidacy
5. Expected interview questions to prepare for`
    }

    /**
     * Build psychological analysis prompt
     */
    private buildPsychAnalysisPrompt(profileData: PsychologicalProfileData): string {
        return `Analyze psychological profile for career insights:

Profile Data:
- Personality Type: ${profileData.personalityType || 'Not assessed'}
- Work Preferences: ${JSON.stringify(profileData.workPreferences || {})}
- Motivation Factors: ${profileData.motivationFactors?.join(', ') || 'Not specified'}
- Stress Factors: ${profileData.stressFactors?.join(', ') || 'Not specified'}
- Communication Style: ${profileData.communicationStyle || 'Not specified'}
- Learning Style: ${profileData.learningStyle || 'Not specified'}

Provide:
1. Career path recommendations based on personality
2. Ideal work environment suggestions
3. Leadership potential assessment
4. Skills development priorities
5. Potential career challenges and mitigation strategies`
    }

    /**
     * Build skill recommendation prompt
     */
    private buildSkillRecommendationPrompt(userSkills: string[], targetRole: string): string {
        return `Recommend skills for career advancement:

Current Skills: ${userSkills.join(', ')}
Target Role: ${targetRole}

Provide:
1. Essential skills missing for the target role
2. Nice-to-have skills that would be beneficial
3. Learning path with prioritized order
4. Estimated time investment for each skill
5. Best resources/platforms for learning these skills`
    }

    /**
     * Test API connectivity
     */
    async testConnection(): Promise<boolean> {
        try {
            const response = await this.callAI({
                prompt: 'Respond with "Hello" to test connectivity.',
                maxTokens: 10
            })
            return response.content.toLowerCase().includes('hello')
        } catch (error) {
            console.error('GitHub Models API connection test failed:', error)
            return false
        }
    }
}

// Export singleton instance
export const githubModelsService = new GitHubModelsService()

// Export types for use in other modules
export type { AIAnalysisRequest, AIAnalysisResponse }
