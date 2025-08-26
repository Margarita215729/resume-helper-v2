// Научно обоснованная система психологического профилирования
// Основана на принципах нейробиологии и психиатрии

export interface PsychologicalQuestion {
    id: string
    category: string
    text: string
    type: 'likert' | 'multiselect' | 'text'
    options?: string[]
    neurobiologicalBasis?: string
    weight: number
}

export interface PsychologicalResponse {
    questionId: string
    value: string | string[]
    additionalComment?: string
}

export interface PsychologicalAnalysis {
    strengths: string[]
    weaknesses: string[]
    personalityTraits: string[]
    strengthLevel: 'Низкий' | 'Средний' | 'Высокий'
    riskLevel: 'Низкий' | 'Средний' | 'Высокий'
    adaptabilityScore: number // 0-1
    recommendations: string[]
    neurobiologicalNotes: Record<string, any>
}

// Комплексная анкета основанная на научных исследованиях
export const psychologicalQuestions: PsychologicalQuestion[] = [
    {
        id: 'stress_handling',
        category: 'Эмоциональная стабильность',
        text: 'Как вы справляетесь со стрессовыми ситуациями на работе?',
        type: 'likert',
        options: [
            'Очень плохо - теряюсь и паникую',
            'Плохо - сильно нервничаю',
            'Удовлетворительно - справляюсь с трудом',
            'Хорошо - остаюсь спокойным',
            'Отлично - процветаю под давлением'
        ],
        neurobiologicalBasis: 'Активация симпатической нервной системы и выброс кортизола влияют на когнитивные функции',
        weight: 0.9
    },
    {
        id: 'social_interaction',
        category: 'Социальные навыки',
        text: 'Как вы чувствуете себя в больших группах людей?',
        type: 'likert',
        options: [
            'Очень некомфортно - избегаю',
            'Некомфортно - быстро устаю',
            'Нейтрально - терплю',
            'Комфортно - участвую в общении',
            'Очень комфортно - энергизируюсь'
        ],
        neurobiologicalBasis: 'Уровень дофамина и серотонина влияет на социальную мотивацию',
        weight: 0.7
    },
    {
        id: 'learning_approach',
        category: 'Когнитивные способности',
        text: 'Как вы предпочитаете изучать новую информацию?',
        type: 'multiselect',
        options: [
            'Читая теоретические материалы',
            'Через практические упражнения',
            'Обсуждая с коллегами',
            'Экспериментируя самостоятельно',
            'Смотря видео и демонстрации',
            'Анализируя реальные примеры'
        ],
        neurobiologicalBasis: 'Различные типы обучения активируют разные области коры головного мозга',
        weight: 0.8
    },
    {
        id: 'decision_making',
        category: 'Когнитивные способности',
        text: 'При принятии важных решений вы больше полагаетесь на:',
        type: 'likert',
        options: [
            'Только интуицию и чувства',
            'Больше интуицию',
            'Баланс интуиции и логики',
            'Больше логику и факты',
            'Только логику и данные'
        ],
        neurobiologicalBasis: 'Префронтальная кора отвечает за рациональное мышление, лимбическая система - за эмоциональное',
        weight: 0.85
    },
    {
        id: 'change_adaptation',
        category: 'Адаптивность',
        text: 'Как вы реагируете на неожиданные изменения в проектах?',
        type: 'likert',
        options: [
            'Очень негативно - сопротивляюсь',
            'Негативно - требуется время',
            'Нейтрально - принимаю как есть',
            'Позитивно - быстро адаптируюсь',
            'Очень позитивно - воспринимаю как возможность'
        ],
        neurobiologicalBasis: 'Пластичность мозга и уровень нейротрансмиттеров влияют на способность к адаптации',
        weight: 0.9
    },
    {
        id: 'work_motivation',
        category: 'Мотивация',
        text: 'Что больше всего мотивирует вас в работе?',
        type: 'multiselect',
        options: [
            'Решение сложных задач',
            'Признание и похвала',
            'Финансовое вознаграждение',
            'Возможность помочь другим',
            'Творческая свобода',
            'Карьерный рост',
            'Стабильность и безопасность',
            'Обучение и развитие'
        ],
        neurobiologicalBasis: 'Дофаминергическая система вознаграждения определяет мотивационные паттерны',
        weight: 0.75
    },
    {
        id: 'conflict_resolution',
        category: 'Межличностные отношения',
        text: 'В конфликтных ситуациях с коллегами вы обычно:',
        type: 'likert',
        options: [
            'Избегаю конфликта любой ценой',
            'Уступаю, чтобы не портить отношения',
            'Ищу компромиссное решение',
            'Отстаиваю свою позицию',
            'Активно ищу решение, выгодное всем'
        ],
        neurobiologicalBasis: 'Активность миндалевидного тела влияет на реакцию "бей или беги" в конфликтах',
        weight: 0.8
    },
    {
        id: 'attention_focus',
        category: 'Когнитивные способности',
        text: 'Насколько легко вы можете сосредоточиться на одной задаче длительное время?',
        type: 'likert',
        options: [
            'Очень сложно - постоянно отвлекаюсь',
            'Сложно - требуются усилия',
            'Средне - зависит от задачи',
            'Легко - могу работать часами',
            'Очень легко - полностью погружаюсь'
        ],
        neurobiologicalBasis: 'Функции внимания связаны с активностью передней поясной коры и префронтальной коры',
        weight: 0.85
    },
    {
        id: 'feedback_reception',
        category: 'Эмоциональная стабильность',
        text: 'Как вы воспринимаете критику и обратную связь?',
        type: 'likert',
        options: [
            'Очень болезненно - долго переживаю',
            'Болезненно - расстраиваюсь',
            'Нейтрально - принимаю к сведению',
            'Конструктивно - анализирую и учитываю',
            'Позитивно - благодарен за возможность роста'
        ],
        neurobiologicalBasis: 'Эмоциональная регуляция зависит от взаимодействия префронтальной коры и лимбической системы',
        weight: 0.8
    },
    {
        id: 'team_role',
        category: 'Социальные навыки',
        text: 'В командной работе вы обычно выступаете в роли:',
        type: 'multiselect',
        options: [
            'Лидера, который ведет команду',
            'Генератора идей',
            'Критического аналитика',
            'Исполнителя задач',
            'Медиатора в спорах',
            'Мотиватора команды',
            'Координатора процессов',
            'Эксперта в своей области'
        ],
        neurobiologicalBasis: 'Социальные роли связаны с активностью зеркальных нейронов и социальной когницией',
        weight: 0.75
    },
    {
        id: 'risk_tolerance',
        category: 'Принятие решений',
        text: 'Ваше отношение к риску в профессиональных решениях:',
        type: 'likert',
        options: [
            'Крайне осторожный - избегаю любых рисков',
            'Осторожный - тщательно взвешиваю',
            'Умеренный - принимаю обоснованные риски',
            'Склонный к риску - люблю новые вызовы',
            'Очень рискованный - предпочитаю смелые решения'
        ],
        neurobiologicalBasis: 'Толерантность к риску связана с активностью дофаминовой системы и префронтальной коры',
        weight: 0.8
    },
    {
        id: 'work_environment',
        category: 'Адаптивность',
        text: 'В какой рабочей среде вы наиболее продуктивны?',
        type: 'multiselect',
        options: [
            'Тихий офис с минимальными отвлечениями',
            'Шумный открытый офис с активностью',
            'Удаленная работа из дома',
            'Коворкинг с разнообразными людьми',
            'Частые командировки и смена обстановки',
            'Структурированная среда с четкими правилами',
            'Гибкая среда с творческой свободой'
        ],
        neurobiologicalBasis: 'Сенсорная обработка и внимание влияют на продуктивность в разных средах',
        weight: 0.7
    },
    {
        id: 'energy_patterns',
        category: 'Биологические ритмы',
        text: 'Когда вы наиболее продуктивны и энергичны?',
        type: 'multiselect',
        options: [
            'Раннее утро (6-9)',
            'Утро (9-12)',
            'День (12-15)',
            'Вторая половина дня (15-18)',
            'Вечер (18-21)',
            'Поздний вечер (21-24)',
            'Продуктивность не зависит от времени'
        ],
        neurobiologicalBasis: 'Циркадные ритмы и хронотип влияют на когнитивную производительность',
        weight: 0.6
    },
    {
        id: 'perfectionism',
        category: 'Рабочий стиль',
        text: 'Ваше отношение к качеству и детализации работы:',
        type: 'likert',
        options: [
            'Сделать быстро, качество вторично',
            'Баланс скорости и качества',
            'Качество важнее скорости',
            'Высокие стандарты качества',
            'Перфекционизм - каждая деталь важна'
        ],
        neurobiologicalBasis: 'Перфекционизм связан с активностью орбитофронтальной коры и серотониновой системы',
        weight: 0.7
    },
    {
        id: 'innovation_approach',
        category: 'Креативность',
        text: 'Как вы подходите к инновациям и новым идеям?',
        type: 'likert',
        options: [
            'Предпочитаю проверенные методы',
            'Осторожно тестирую новое',
            'Открыт к экспериментам',
            'Активно ищу новые подходы',
            'Постоянно генерирую инновации'
        ],
        neurobiologicalBasis: 'Креативность связана с активностью дефолт-сети мозга и дивергентным мышлением',
        weight: 0.75
    }
]

/**
 * Анализирует психологический профиль на основе ответов
 */
export function analyzePsychologicalProfile(responses: PsychologicalResponse[]): PsychologicalAnalysis {
    const responseMap = new Map(responses.map(r => [r.questionId, r]))

    const strengths: string[] = []
    const weaknesses: string[] = []
    const personalityTraits: string[] = []
    const recommendations: string[] = []
    const neurobiologicalNotes: Record<string, any> = {}

    let totalScore = 0
    let maxScore = 0
    let adaptabilityScore = 0
    let stressScore = 0
    let socialScore = 0

    // Анализ каждого ответа
    psychologicalQuestions.forEach(question => {
        const response = responseMap.get(question.id)
        if (!response) return

        const weight = question.weight
        maxScore += weight * 5 // Максимум 5 баллов за вопрос

        let score = 0
        if (question.type === 'likert') {
            const optionIndex = question.options?.indexOf(response.value as string) ?? -1
            score = (optionIndex + 1) * weight
        } else if (question.type === 'multiselect') {
            const selectedOptions = response.value as string[]
            score = (selectedOptions.length / (question.options?.length ?? 1)) * 5 * weight
        }

        totalScore += score

        // Специфический анализ по категориям
        switch (question.id) {
            case 'stress_handling':
                stressScore = score / weight
                if (score >= 4 * weight) {
                    strengths.push('Отличная стрессоустойчивость')
                    personalityTraits.push('Эмоционально стабильный')
                } else if (score <= 2 * weight) {
                    weaknesses.push('Низкая стрессоустойчивость')
                    recommendations.push('Изучите техники управления стрессом')
                }
                neurobiologicalNotes[question.id] = {
                    score: score / weight,
                    interpretation: 'Активация симпатической нервной системы',
                    recommendations: score < 3 * weight ? ['Медитация', 'Дыхательные упражнения'] : []
                }
                break

            case 'social_interaction':
                socialScore = score / weight
                if (score >= 4 * weight) {
                    strengths.push('Высокие социальные навыки')
                    personalityTraits.push('Экстравертированный')
                } else if (score <= 2 * weight) {
                    personalityTraits.push('Интровертированный')
                    recommendations.push('Развивайте навыки коммуникации в малых группах')
                }
                break

            case 'change_adaptation':
                adaptabilityScore = score / weight
                if (score >= 4 * weight) {
                    strengths.push('Высокая адаптивность')
                    personalityTraits.push('Гибкий мыслитель')
                } else if (score <= 2 * weight) {
                    weaknesses.push('Трудности с адаптацией')
                    recommendations.push('Практикуйте принятие изменений через малые шаги')
                }
                break

            case 'decision_making':
                const decisionStyle = (response.value as string).includes('логик') ? 'Аналитический' : 'Интуитивный'
                personalityTraits.push(`${decisionStyle} тип мышления`)
                break

            case 'work_motivation':
                const motivators = response.value as string[]
                if (motivators.includes('Решение сложных задач')) {
                    strengths.push('Мотивация к сложным вызовам')
                }
                if (motivators.includes('Возможность помочь другим')) {
                    personalityTraits.push('Просоциальная мотивация')
                }
                break

            case 'perfectionism':
                if (score >= 4 * weight) {
                    personalityTraits.push('Перфекционист')
                    recommendations.push('Балансируйте качество и эффективность')
                }
                break
        }
    })

    // Определение общих характеристик
    const overallScore = totalScore / maxScore
    const strengthLevel = overallScore >= 0.7 ? 'Высокий' : overallScore >= 0.4 ? 'Средний' : 'Низкий'

    const riskLevel = (() => {
        if (stressScore <= 2 && adaptabilityScore <= 2) return 'Высокий'
        if (stressScore >= 4 && adaptabilityScore >= 4) return 'Низкий'
        return 'Средний'
    })()

    // Нормализация адаптивности (0-1)
    const normalizedAdaptability = Math.min(Math.max(adaptabilityScore / 5, 0), 1)

    // Общие рекомендации
    if (socialScore >= 4) {
        recommendations.push('Рассмотрите лидерские роли')
    }
    if (overallScore < 0.5) {
        recommendations.push('Рекомендуется консультация с психологом для персонального развития')
    }

    return {
        strengths: [...new Set(strengths)],
        weaknesses: [...new Set(weaknesses)],
        personalityTraits: [...new Set(personalityTraits)],
        strengthLevel,
        riskLevel,
        adaptabilityScore: normalizedAdaptability,
        recommendations: [...new Set(recommendations)],
        neurobiologicalNotes
    }
}
