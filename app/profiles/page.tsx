'use client'

import ProfileManager from '@/components/ProfileManager'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProfilesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Профили пользователей</h1>
                    <Link href="/">
                        <Button variant="outline">
                            ← Вернуться на главную
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <ProfileManager />
                </div>

                <div className="mt-8 text-center">
                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <Link href="/questionnaire">
                            <Button className="w-full" size="lg">
                                Создать новый профиль
                            </Button>
                        </Link>
                        <Link href="/resume-generator">
                            <Button variant="outline" className="w-full" size="lg">
                                Генератор резюме
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
