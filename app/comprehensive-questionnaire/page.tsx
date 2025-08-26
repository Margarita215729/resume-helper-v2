'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Brain,
    CheckCircle,
    FileText,
    Upload,
    User
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Компоненты (заглушки для демонстрации)
const PsychologicalQuestionnaire = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Психологическое профилирование
            </CardTitle>
            <CardDescription>
                Научно обоснованный анализ личности для создания персонализированных резюме
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4">Этот компонент будет восстановлен в следующем шаге...</p>
            <Button onClick={() => onComplete({ completed: true })}>
                Завершить анкету (демо)
            </Button>
        </CardContent>
    </Card>
)

const ResumeUploader = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Загрузка резюме
            </CardTitle>
            <CardDescription>
                Загрузите существующие резюме для автоматического извлечения данных
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Перетащите файлы сюда или нажмите для выбора</p>
                <p className="text-sm text-gray-500">Поддерживаются PDF, DOC, DOCX, TXT</p>
                <Button
                    className="mt-4"
                    onClick={() => onComplete({ files: [], extracted: true })}
                >
                    Пропустить загрузку (демо)
                </Button>
            </div>
        </CardContent>
    </Card>
)

const AdditionalProfileData = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Дополнительные данные профиля
            </CardTitle>
            <CardDescription>
                Добавьте навыки и опыт, которые не были извлечены автоматически
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4">Этот компонент будет восстановлен в следующем шаге...</p>
            <Button onClick={() => onComplete({ additionalData: true })}>
                Завершить ввод данных (демо)
            </Button>
        </CardContent>
    </Card>
)

// Основные этапы анкетирования
const steps = [
    {
        id: 'psychological',
        title: 'Психологический анализ',
        description: 'Пройдите научно обоснованную анкету для определения психологического профиля',
        icon: Brain,
        component: PsychologicalQuestionnaire,
        estimatedTime: '10-15 минут'
    },
    {
        id: 'upload',
        title: 'Загрузка резюме',
        description: 'Загрузите существующие резюме для автоматического парсинга данных',
        icon: Upload,
        component: ResumeUploader,
        estimatedTime: '3-5 минут'
    },
    {
        id: 'additional',
        title: 'Дополнительные данные',
        description: 'Добавьте навыки и опыт, которые могли быть пропущены при парсинге',
        icon: User,
        component: AdditionalProfileData,
        estimatedTime: '5-10 минут'
    },
    {
        id: 'review',
        title: 'Обзор и завершение',
        description: 'Просмотрите собранную информацию и получите рекомендации',
        icon: CheckCircle,
        estimatedTime: '2-3 минуты'
    }
]

export default function ComprehensiveQuestionnairePage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
    const [stepData, setStepData] = useState<Record<string, any>>({})

    const currentStepData = steps[currentStep]
    const isLastStep = currentStep === steps.length - 1
    const canProceed = completedSteps.has(currentStep)

    const progress = ((currentStep + 1) / steps.length) * 100

    const handleStepComplete = (data: any) => {
        setStepData(prev => ({
            ...prev,
            [currentStepData.id]: data
        }))
        setCompletedSteps(prev => new Set([...prev, currentStep]))
    }

    const handleNext = () => {
        if (canProceed && !isLastStep) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleFinish = () => {
        // Здесь должна быть логика сохранения данных
        console.log('Completed questionnaire with data:', stepData)
        // Перенаправление в профиль
        window.location.href = '/profile'
    }

    const renderStepContent = () => {
        if (isLastStep) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Анализ завершен!
                        </CardTitle>
                        <CardDescription>
                            Ваш комплексный профиль успешно создан
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg bg-green-50">
                                <h4 className="font-medium text-green-800 mb-2">✅ Психологический профиль</h4>
                                <p className="text-sm text-green-700">Анализ личности завершен</p>
                            </div>

                            <div className="p-4 border rounded-lg bg-blue-50">
                                <h4 className="font-medium text-blue-800 mb-2">📄 Резюме обработано</h4>
                                <p className="text-sm text-blue-700">Данные извлечены и структурированы</p>
                            </div>

                            <div className="p-4 border rounded-lg bg-purple-50">
                                <h4 className="font-medium text-purple-800 mb-2">🎯 Профиль дополнен</h4>
                                <p className="text-sm text-purple-700">Дополнительные навыки добавлены</p>
                            </div>

                            <div className="p-4 border rounded-lg bg-orange-50">
                                <h4 className="font-medium text-orange-800 mb-2">🤖 AI готов к работе</h4>
                                <p className="text-sm text-orange-700">Система готова к персонализации</p>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold">Что дальше?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link href="/profile">
                                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                            <p className="font-medium">Личный кабинет</p>
                                            <p className="text-xs text-gray-500">Управление профилем</p>
                                        </CardContent>
                                    </Card>
                                </Link>

                                <Link href="/resume-generator">
                                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                            <p className="font-medium">Создать резюме</p>
                                            <p className="text-xs text-gray-500">Генерация документов</p>
                                        </CardContent>
                                    </Card>
                                </Link>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleFinish}>
                                    <CardContent className="p-4 text-center">
                                        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                        <p className="font-medium">Аналитика</p>
                                        <p className="text-xs text-gray-500">Просмотр рекомендаций</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        const StepComponent = currentStepData.component
        return StepComponent ? (
            <StepComponent onComplete={handleStepComplete} />
        ) : null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Назад на главную
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Комплексное профилирование
                    </h1>
                    <p className="text-gray-600">
                        Создайте персонализированный профиль для генерации резюме с AI-анализом
                    </p>
                </div>

                {/* Прогресс */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                Шаг {currentStep + 1} из {steps.length}: {currentStepData.title}
                            </h2>
                            <Badge variant="secondary">
                                {currentStepData.estimatedTime}
                            </Badge>
                        </div>

                        <Progress value={progress} className="mb-4" />

                        <div className="flex justify-between text-sm text-gray-600">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`flex items-center ${index === currentStep ? 'text-blue-600 font-medium' :
                                            completedSteps.has(index) ? 'text-green-600' : 'text-gray-400'
                                        }`}
                                >
                                    <step.icon className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">{step.title}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Содержимое шага */}
                <div className="mb-8">
                    {renderStepContent()}
                </div>

                {/* Навигация */}
                {!isLastStep && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Назад
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={!canProceed}
                        >
                            Далее
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                )}

                {isLastStep && (
                    <div className="text-center">
                        <Button
                            size="lg"
                            onClick={handleFinish}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            Завершить настройку профиля
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
