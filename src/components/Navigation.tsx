'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
    const pathname = usePathname()

    return (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🚀</span>
                        <span className="text-xl font-bold text-gray-900">Resume Helper</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link href="/questionnaire">
                            <Button
                                variant={pathname === '/questionnaire' ? 'default' : 'ghost'}
                                size="sm"
                            >
                                📝 Questionnaire
                            </Button>
                        </Link>

                        <Link href="/resume-generator">
                            <Button
                                variant={pathname === '/resume-generator' ? 'default' : 'ghost'}
                                size="sm"
                            >
                                🤖 Generate Resume
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
