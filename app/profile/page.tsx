'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Award,
    BarChart3,
    Brain,
    Briefcase,
    Download,
    Edit,
    FileText,
    Plus,
    Trash2,
    User
} from 'lucide-react'
import { useState } from 'react'

// Mock данные для демонстрации
const mockUserData = {
    firstName: 'Анна',
    lastName: 'Иванова',
    email: 'anna.ivanova@example.com',
    phone: '+7 (999) 123-45-67',
    location: 'Москва, Россия',
    profileImage: null,
    summary: 'Опытный frontend разработчик с 5+ годами опыта в React и TypeScript',

    skills: [
        { id: '1', name: 'React', category: 'technical', proficiencyLevel: 'expert', yearsOfExperience: 5 },
        { id: '2', name: 'TypeScript', category: 'technical', proficiencyLevel: 'advanced', yearsOfExperience: 3 },
        { id: '3', name: 'Node.js', category: 'technical', proficiencyLevel: 'intermediate', yearsOfExperience: 2 },
        { id: '4', name: 'Лидерство', category: 'soft', proficiencyLevel: 'advanced', yearsOfExperience: 3 },
        { id: '5', name: 'Командная работа', category: 'soft', proficiencyLevel: 'expert', yearsOfExperience: 5 }
    ],

    experiences: [
        {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            startDate: '2022-01-01',
            endDate: null,
            description: 'Разработка крупномасштабных React приложений',
            achievements: ['Увеличил производительность на 40%', 'Внедрил TypeScript']
        },
        {
            id: '2',
            title: 'Frontend Developer',
            company: 'StartupXYZ',
            startDate: '2020-06-01',
            endDate: '2021-12-31',
            description: 'Создание пользовательских интерфейсов',
            achievements: ['Создал дизайн-систему', 'Оптимизировал SEO']
        }
    ],

    psychProfile: {
        strengths: ['Аналитическое мышление', 'Креативность', 'Лидерские качества'],
        weaknesses: ['Перфекционизм', 'Нетерпеливость'],
        adaptabilityScore: 0.85,
        strengthLevel: 'Высокий',
        riskLevel: 'Низкий',
        recommendations: ['Развивать навыки публичных выступлений', 'Изучать новые технологии']
    },

    resumes: [
        { id: '1', title: 'Резюме Frontend Developer', createdAt: '2024-01-15', downloadCount: 5 },
        { id: '2', title: 'Резюме React Developer', createdAt: '2024-01-20', downloadCount: 3 }
    ]
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('overview')
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState(mockUserData)

    const tabs = [
        { id: 'overview', label: 'Обзор', icon: User },
        { id: 'skills', label: 'Навыки', icon: Award },
        { id: 'experience', label: 'Опыт', icon: Briefcase },
        { id: 'psychology', label: 'Психология', icon: Brain },
        { id: 'resumes', label: 'Резюме', icon: FileText },
        { id: 'analytics', label: 'Аналитика', icon: BarChart3 }
    ]

    const skillCategories = {
        technical: 'Технические навыки',
        soft: 'Мягкие навыки',
        language: 'Языки'
    }

    const proficiencyColors = {
        beginner: 'bg-red-100 text-red-800',
        intermediate: 'bg-yellow-100 text-yellow-800',
        advanced: 'bg-blue-100 text-blue-800',
        expert: 'bg-green-100 text-green-800'
    }

    const renderOverview = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Личная информация</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit className="w-4 h-4 mr-1" />
                            {isEditing ? 'Сохранить' : 'Редактировать'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start space-x-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={userData.profileImage || undefined} />
                            <AvatarFallback className="text-lg">
                                {userData.firstName[0]}{userData.lastName[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Имя"
                                        value={userData.firstName}
                                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Фамилия"
                                        value={userData.lastName}
                                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Телефон"
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    />
                                    <div className="col-span-2">
                                        <Textarea
                                            placeholder="Краткое описание"
                                            value={userData.summary}
                                            onChange={(e) => setUserData({ ...userData, summary: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
                                    <p className="text-gray-600">{userData.email}</p>
                                    <p className="text-gray-600">{userData.phone}</p>
                                    <p className="text-gray-600">{userData.location}</p>
                                    <p className="mt-2">{userData.summary}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Award className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-2xl font-bold">{userData.skills.length}</p>
                                <p className="text-sm text-gray-600">Навыков</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Briefcase className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-2xl font-bold">{userData.experiences.length}</p>
                                <p className="text-sm text-gray-600">Мест работы</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <FileText className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-2xl font-bold">{userData.resumes.length}</p>
                                <p className="text-sm text-gray-600">Резюме</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    const renderSkills = () => (
        <div className="space-y-6">
            {Object.entries(skillCategories).map(([category, categoryName]) => {
                const categorySkills = userData.skills.filter(skill => skill.category === category)

                return (
                    <Card key={category}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{categoryName}</CardTitle>
                                <Button size="sm" variant="outline">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Добавить
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categorySkills.map(skill => (
                                    <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <h4 className="font-medium">{skill.name}</h4>
                                            <p className="text-sm text-gray-600">{skill.yearsOfExperience} лет опыта</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={proficiencyColors[skill.proficiencyLevel as keyof typeof proficiencyColors]}>
                                                {skill.proficiencyLevel}
                                            </Badge>
                                            <Button size="sm" variant="ghost">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )

    const renderExperience = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Опыт работы</h2>
                <Button>
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить опыт
                </Button>
            </div>

            {userData.experiences.map(exp => (
                <Card key={exp.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{exp.title}</CardTitle>
                                <CardDescription>{exp.company}</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'настоящее время'}
                        </p>
                        <p className="mb-3">{exp.description}</p>
                        <div>
                            <h4 className="font-medium mb-2">Достижения:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {exp.achievements.map((achievement, index) => (
                                    <li key={index} className="text-sm">{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    const renderPsychology = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Brain className="w-5 h-5 mr-2" />
                        Психологический профиль
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-3 text-green-700">Сильные стороны</h4>
                            <div className="space-y-2">
                                {userData.psychProfile.strengths.map((strength, index) => (
                                    <Badge key={index} variant="success">{strength}</Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-3 text-orange-700">Области для развития</h4>
                            <div className="space-y-2">
                                {userData.psychProfile.weaknesses.map((weakness, index) => (
                                    <Badge key={index} variant="warning">{weakness}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                                {Math.round(userData.psychProfile.adaptabilityScore * 100)}%
                            </p>
                            <p className="text-sm text-gray-600">Адаптивность</p>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-lg font-bold text-green-600">{userData.psychProfile.strengthLevel}</p>
                            <p className="text-sm text-gray-600">Уровень силы</p>
                        </div>

                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-lg font-bold text-orange-600">{userData.psychProfile.riskLevel}</p>
                            <p className="text-sm text-gray-600">Уровень риска</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-medium mb-3">Рекомендации по развитию</h4>
                        <ul className="space-y-2">
                            {userData.psychProfile.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-sm">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const renderResumes = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Мои резюме</h2>
                <Button>
                    <Plus className="w-4 h-4 mr-1" />
                    Создать резюме
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.resumes.map(resume => (
                    <Card key={resume.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{resume.title}</CardTitle>
                            <CardDescription>
                                Создано: {new Date(resume.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Скачано: {resume.downloadCount} раз
                                </p>
                                <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                        <Download className="w-4 h-4 mr-1" />
                                        Скачать
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )

    const renderAnalytics = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Аналитика профиля
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">85%</p>
                            <p className="text-sm text-gray-600">Полнота профиля</p>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">12</p>
                            <p className="text-sm text-gray-600">Просмотров резюме</p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">7</p>
                            <p className="text-sm text-gray-600">Соответствующих вакансий</p>
                        </div>

                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">92%</p>
                            <p className="text-sm text-gray-600">ATS совместимость</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Рекомендации по улучшению профиля</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="font-medium">Добавьте портфолио</p>
                                <p className="text-sm text-gray-600">Загрузите примеры ваших работ для повышения привлекательности профиля</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="font-medium">Обновите фото профиля</p>
                                <p className="text-sm text-gray-600">Профессиональное фото увеличивает доверие работодателей</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="font-medium">Получите рекомендации</p>
                                <p className="text-sm text-gray-600">Попросите коллег написать рекомендации для укрепления профиля</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview()
            case 'skills': return renderSkills()
            case 'experience': return renderExperience()
            case 'psychology': return renderPsychology()
            case 'resumes': return renderResumes()
            case 'analytics': return renderAnalytics()
            default: return renderOverview()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
                    <p className="text-gray-600">Управляйте своим профилем и отслеживайте прогресс</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Навигация */}
                    <div className="lg:w-64">
                        <Card>
                            <CardContent className="p-4">
                                <nav className="space-y-2">
                                    {tabs.map(tab => {
                                        const Icon = tab.icon
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${activeTab === tab.id
                                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4 mr-3" />
                                                {tab.label}
                                            </button>
                                        )
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Основной контент */}
                    <div className="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}
