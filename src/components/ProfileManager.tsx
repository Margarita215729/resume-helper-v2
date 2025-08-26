'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    deleteProfile,
    exportProfile,
    getCurrentProfile,
    getDocuments,
    getProfiles,
    importProfile,
    setCurrentProfile,
    type SavedProfile
} from '@/lib/storage'
import { useEffect, useState } from 'react'

interface ProfileManagerProps {
    onProfileSelect?: (profile: SavedProfile) => void
    className?: string
}

export default function ProfileManager({ onProfileSelect, className }: ProfileManagerProps) {
    const [profiles, setProfiles] = useState<SavedProfile[]>([])
    const [currentProfile, setCurrentProfileState] = useState<SavedProfile | null>(null)
    const [importData, setImportData] = useState('')
    const [showImport, setShowImport] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadProfiles()
    }, [])

    const loadProfiles = () => {
        const allProfiles = getProfiles()
        const current = getCurrentProfile()
        setProfiles(allProfiles)
        setCurrentProfileState(current)
    }

    const handleSelectProfile = (profile: SavedProfile) => {
        setCurrentProfile(profile.id)
        setCurrentProfileState(profile)
        onProfileSelect?.(profile)
    }

    const handleDeleteProfile = (profileId: string) => {
        if (confirm('Вы уверены, что хотите удалить этот профиль? Все связанные документы также будут удалены.')) {
            deleteProfile(profileId)
            loadProfiles()
        }
    }

    const handleExportProfile = (profileId: string) => {
        try {
            const exportData = exportProfile(profileId)
            const blob = new Blob([exportData], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `resume-profile-${profileId}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Export error:', error)
            alert('Ошибка при экспорте профиля')
        }
    }

    const handleImportProfile = async () => {
        if (!importData.trim()) return

        setIsLoading(true)
        try {
            const imported = importProfile(importData)
            loadProfiles()
            setImportData('')
            setShowImport(false)
            alert(`Профиль "${imported.name}" успешно импортирован`)
        } catch (error) {
            console.error('Import error:', error)
            alert('Ошибка при импорте профиля')
        } finally {
            setIsLoading(false)
        }
    }

    const getProfileStats = (profile: SavedProfile) => {
        const documents = getDocuments(profile.id)
        const completionPercentage = Math.round((profile.questionnaireData.length / 10) * 100)

        return {
            documentsCount: documents.length,
            completionPercentage,
            lastModified: new Date(profile.lastModified).toLocaleDateString('ru-RU')
        }
    }

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Управление профилями</h2>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setShowImport(!showImport)}
                        variant="outline"
                    >
                        Импорт профиля
                    </Button>
                </div>
            </div>

            {/* Import Section */}
            {showImport && (
                <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Импорт профиля</h3>
                    <div className="space-y-3">
                        <textarea
                            value={importData}
                            onChange={(e) => setImportData(e.target.value)}
                            placeholder="Вставьте JSON данные экспортированного профиля..."
                            className="w-full p-3 border rounded-md h-32 text-sm font-mono"
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={handleImportProfile}
                                disabled={!importData.trim() || isLoading}
                            >
                                {isLoading ? 'Импорт...' : 'Импортировать'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowImport(false)
                                    setImportData('')
                                }}
                                variant="outline"
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Current Profile */}
            {currentProfile && (
                <Card className="p-4 border-blue-200 bg-blue-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900">
                                Текущий профиль: {currentProfile.name}
                            </h3>
                            <div className="text-sm text-blue-700 mt-1">
                                {(() => {
                                    const stats = getProfileStats(currentProfile)
                                    return (
                                        <div className="space-y-1">
                                            <p>Заполнено: {stats.completionPercentage}%</p>
                                            <p>Документов: {stats.documentsCount}</p>
                                            <p>Изменён: {stats.lastModified}</p>
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleExportProfile(currentProfile.id)}
                                variant="outline"
                                size="sm"
                            >
                                Экспорт
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Profiles List */}
            <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Все профили ({profiles.length})</h3>

                {profiles.length === 0 ? (
                    <Card className="p-6 text-center">
                        <p className="text-gray-500">Профили не найдены</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Создайте новый профиль, заполнив анкету в генераторе резюме
                        </p>
                    </Card>
                ) : (
                    profiles.map((profile) => {
                        const stats = getProfileStats(profile)
                        const isCurrentProfile = currentProfile?.id === profile.id

                        return (
                            <Card
                                key={profile.id}
                                className={`p-4 ${isCurrentProfile ? 'ring-2 ring-blue-500' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            {profile.name}
                                            {isCurrentProfile && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    Активный
                                                </span>
                                            )}
                                        </h4>
                                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                                            <p>Заполнено: {stats.completionPercentage}%</p>
                                            <p>Документов: {stats.documentsCount}</p>
                                            <p>Изменён: {stats.lastModified}</p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-3">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${stats.completionPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        {!isCurrentProfile && (
                                            <Button
                                                onClick={() => handleSelectProfile(profile)}
                                                size="sm"
                                            >
                                                Выбрать
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleExportProfile(profile.id)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Экспорт
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteProfile(profile.id)}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>

            {/* Storage Statistics */}
            <Card className="p-4 bg-gray-50">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Статистика хранилища</h4>
                <div className="text-xs text-gray-600 space-y-1">
                    <p>Всего профилей: {profiles.length}</p>
                    <p>Всего документов: {profiles.reduce((sum, p) => sum + getDocuments(p.id).length, 0)}</p>
                </div>
            </Card>
        </div>
    )
}
