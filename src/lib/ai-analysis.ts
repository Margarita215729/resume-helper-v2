// Типы для AI анализа
export interface PsychologicalProfile {
    id: string
    strengths: string[]
    weaknesses: string[]
    adaptabilityScore: number
    [key: string]: any
}

export interface Job {
    id: string
    title: string
    description: string
    requirements: string[]
    skills: string[]
    [key: string]: any
}

export interface UserProfile {
    id: string
    skills: Array<{
        name: string
        proficiencyLevel: string
        [key: string]: any
    }>
    experiences: Array<{
        title: string
        description?: string
        [key: string]: any
    }>
    user: {
        psychProfile?: PsychologicalProfile
    }
    [key: string]: any
}

export interface JobMatchAnalysis {
    jobId: string
    matchScore: number // 0-100
    strengths: string[]
    gaps: string[]
    recommendations: string[]
    psychologicalFit: string
    confidence: number // 0-1
}

export interface ResumeOptimization {
    originalScore: number
    optimizedScore: number
    keywordSuggestions: string[]
    contentImprovements: string[]
    atsCompatibility: number
    recommendations: string[]
}

export class AIAnalysisService {
    /**
     * Анализирует соответствие пользователя конкретной вакансии
     */
    static async analyzeJobMatch(
        userProfile: UserProfile & {
            skills: any[]
            experiences: any[]
            user: {
                psychProfile?: PsychologicalProfile
            }
        },
        job: Job
    ): Promise<JobMatchAnalysis> {
        const skills = userProfile.skills || []
        const experiences = userProfile.experiences || []
        const psychProfile = userProfile.user.psychProfile

        // Анализ навыков
        const userSkills = skills.map(s => s.name.toLowerCase())
        const requiredSkills = job.skills.map(s => s.toLowerCase())
        const matchingSkills = userSkills.filter(skill =>
            requiredSkills.some(required => required.includes(skill) || skill.includes(required))
        )

        const skillsScore = (matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100

        // Анализ опыта
        const relevantExperience = experiences.filter(exp =>
            job.requirements.some(req =>
                exp.title.toLowerCase().includes(req.toLowerCase()) ||
                exp.description?.toLowerCase().includes(req.toLowerCase())
            )
        )

        const experienceScore = Math.min((relevantExperience.length / Math.max(job.requirements.length, 1)) * 100, 100)

        // Психологический анализ
        let psychologicalScore = 50 // базовый
        let psychologicalFit = "Нейтральное соответствие"

        if (psychProfile) {
            const strengths = psychProfile.strengths || []
            const adaptabilityScore = psychProfile.adaptabilityScore || 0.5

            // Анализ соответствия на основе психопрофиля
            const jobKeywords = [job.title, job.description, ...job.requirements].join(' ').toLowerCase()

            if (jobKeywords.includes('leadership') || jobKeywords.includes('manager')) {
                if (strengths.includes('Лидерские качества') || strengths.includes('Управленческие навыки')) {
                    psychologicalScore += 20
                    psychologicalFit = "Высокое соответствие лидерской роли"
                }
            }

            if (jobKeywords.includes('team') || jobKeywords.includes('collaborative')) {
                if (strengths.includes('Командная работа') || strengths.includes('Коммуникативные навыки')) {
                    psychologicalScore += 15
                    psychologicalFit = "Отличное соответствие командной работе"
                }
            }

            if (adaptabilityScore > 0.7) {
                psychologicalScore += 10
                psychologicalFit += " (высокая адаптивность)"
            }
        }

        // Общий счет
        const matchScore = Math.round((skillsScore * 0.4 + experienceScore * 0.4 + psychologicalScore * 0.2))

        // Определение пробелов
        const missingSkills = requiredSkills.filter(skill =>
            !userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
        )

        return {
            jobId: job.id,
            matchScore: Math.min(matchScore, 100),
            strengths: [
                ...matchingSkills.map(skill => `Навык: ${skill}`),
                ...relevantExperience.map(exp => `Опыт: ${exp.title}`)
            ],
            gaps: [
                ...missingSkills.map(skill => `Требуется навык: ${skill}`),
                ...(relevantExperience.length === 0 ? ["Недостаточно релевантного опыта"] : [])
            ],
            recommendations: this.generateRecommendations(matchScore, missingSkills, psychProfile),
            psychologicalFit,
            confidence: this.calculateConfidence(userProfile, job)
        }
    }

    /**
     * Оптимизирует резюме под конкретную вакансию
     */
    static async optimizeResume(
        resumeContent: any,
        job: Job,
        psychProfile?: PsychologicalProfile
    ): Promise<ResumeOptimization> {
        const originalScore = this.calculateATSScore(resumeContent, job)

        // Анализ ключевых слов
        const jobKeywords = this.extractKeywords(job)
        const resumeKeywords = this.extractResumeKeywords(resumeContent)

        const missingKeywords = jobKeywords.filter(keyword =>
            !resumeKeywords.some(resumeKeyword =>
                resumeKeyword.toLowerCase().includes(keyword.toLowerCase())
            )
        )

        // Предложения по улучшению
        const improvements = [
            ...missingKeywords.map(keyword => `Добавить ключевое слово: "${keyword}"`),
            "Оптимизировать заголовки секций для ATS",
            "Добавить количественные достижения",
            "Улучшить структуру документа"
        ]

        // Психологические рекомендации
        if (psychProfile) {
            const strengths = psychProfile.strengths || []
            improvements.push(
                ...strengths.map(strength => `Подчеркнуть: ${strength}`)
            )
        }

        const optimizedScore = Math.min(originalScore + (missingKeywords.length * 5), 95)

        return {
            originalScore,
            optimizedScore,
            keywordSuggestions: missingKeywords,
            contentImprovements: improvements,
            atsCompatibility: optimizedScore,
            recommendations: [
                "Адаптировать резюме под конкретные требования вакансии",
                "Использовать ключевые слова из описания вакансии",
                "Добавить количественные метрики достижений",
                "Оптимизировать формат для ATS систем"
            ]
        }
    }

    /**
     * Генерирует рекомендации на основе анализа
     */
    private static generateRecommendations(
        matchScore: number,
        missingSkills: string[],
        psychProfile?: PsychologicalProfile
    ): string[] {
        const recommendations: string[] = []

        if (matchScore < 30) {
            recommendations.push("Рассмотрите возможность получения дополнительного образования")
            recommendations.push("Развивайте недостающие навыки через онлайн-курсы")
        } else if (matchScore < 60) {
            recommendations.push("Подчеркните релевантный опыт в резюме")
            recommendations.push("Получите сертификации по ключевым технологиям")
        } else {
            recommendations.push("Выделите свои сильные стороны в сопроводительном письме")
            recommendations.push("Подготовьтесь к техническому собеседованию")
        }

        if (missingSkills.length > 0) {
            recommendations.push(`Изучите: ${missingSkills.slice(0, 3).join(', ')}`)
        }

        if (psychProfile) {
            const weaknesses = psychProfile.weaknesses || []
            if (weaknesses.length > 0) {
                recommendations.push(`Поработайте над: ${weaknesses[0]}`)
            }
        }

        return recommendations
    }

    /**
     * Рассчитывает уверенность в анализе
     */
    private static calculateConfidence(userProfile: any, job: Job): number {
        let confidence = 0.5 // базовый уровень

        // Больше данных = больше уверенности
        if (userProfile.skills?.length > 0) confidence += 0.2
        if (userProfile.experiences?.length > 0) confidence += 0.2
        if (userProfile.user.psychProfile) confidence += 0.1

        return Math.min(confidence, 1.0)
    }

    /**
     * Рассчитывает ATS совместимость
     */
    private static calculateATSScore(resumeContent: any, job: Job): number {
        // Базовая логика для демо
        const hasStructure = resumeContent.sections?.length > 0
        const hasKeywords = job.skills.some(skill =>
            JSON.stringify(resumeContent).toLowerCase().includes(skill.toLowerCase())
        )

        let score = 40 // базовый
        if (hasStructure) score += 30
        if (hasKeywords) score += 20

        return Math.min(score, 90)
    }

    /**
     * Извлекает ключевые слова из вакансии
     */
    private static extractKeywords(job: Job): string[] {
        const allText = [job.title, job.description, ...job.requirements, ...job.skills].join(' ')

        // Простая логика извлечения ключевых слов
        const keywords = allText
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 3)
            .filter(word => !['and', 'the', 'for', 'with', 'you', 'will', 'our'].includes(word))

        return [...new Set(keywords)] // уникальные
    }

    /**
     * Извлекает ключевые слова из резюме
     */
    private static extractResumeKeywords(resumeContent: any): string[] {
        const text = JSON.stringify(resumeContent).toLowerCase()

        return text
            .split(/\s+/)
            .filter(word => word.length > 3)
            .filter(word => !['and', 'the', 'for', 'with'].includes(word))
    }
}
