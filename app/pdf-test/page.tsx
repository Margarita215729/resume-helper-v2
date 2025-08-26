'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { downloadPDF, generateCoverLetterPDF, generateResumePDF } from '@/lib/pdf-generator'
import { QuestionnaireResponse } from '@/types/resume'

const sampleProfile: QuestionnaireResponse[] = [
    { category: 'Personal', question: 'What is your full name?', answer: 'John Doe', weight: 1 },
    { category: 'Personal', question: 'What is your email address?', answer: 'john.doe@email.com', weight: 1 },
    { category: 'Personal', question: 'What is your phone number?', answer: '+1 (555) 123-4567', weight: 1 },
    { category: 'Personal', question: 'Where are you located?', answer: 'San Francisco, CA', weight: 1 },
    { category: 'Experience', question: 'How many years of professional experience do you have?', answer: '5', weight: 3 },
    { category: 'Experience', question: 'What is your current job title?', answer: 'Senior Frontend Developer', weight: 2 },
    { category: 'Experience', question: 'Describe your professional background in 2-3 sentences', answer: 'Experienced frontend developer with 5+ years building modern web applications. Specialized in React, TypeScript, and user experience design. Led multiple successful projects from conception to deployment.', weight: 3 },
    { category: 'Technical Skills', question: 'What programming languages do you know?', answer: 'JavaScript, TypeScript, Python', weight: 3 },
    { category: 'Technical Skills', question: 'What frameworks/libraries have you worked with?', answer: 'React, Next.js, Vue.js, Node.js', weight: 2 },
    { category: 'Technical Skills', question: 'What databases have you worked with?', answer: 'PostgreSQL, MongoDB, Redis', weight: 2 },
    { category: 'Technical Skills', question: 'What development tools do you use regularly?', answer: 'VS Code, Git, Docker, AWS', weight: 2 },
    { category: 'Education', question: 'What is your highest level of education?', answer: 'Bachelor\'s Degree', weight: 2 },
    { category: 'Education', question: 'What was your field of study?', answer: 'Computer Science', weight: 2 },
    { category: 'Languages', question: 'What languages do you speak and at what level?', answer: 'English (Native), Spanish (Conversational)', weight: 2 },
    { category: 'Certifications', question: 'Do you have any professional certifications?', answer: 'AWS Certified Developer, Google Analytics Certified', weight: 2 }
]

const sampleResume = `# John Doe
**Senior Frontend Developer**

## Professional Summary
Experienced frontend developer with 5+ years building modern web applications. Specialized in React, TypeScript, and user experience design. Led multiple successful projects from conception to deployment.

## Technical Skills
- **Programming Languages**: JavaScript, TypeScript, Python
- **Frameworks/Libraries**: React, Next.js, Vue.js, Node.js  
- **Databases**: PostgreSQL, MongoDB, Redis
- **Development Tools**: VS Code, Git, Docker, AWS

## Professional Experience
**Senior Frontend Developer** (Current Position)
- 5 years of professional experience
- Led development of multiple web applications
- Specialized in React and TypeScript development
- Mentored junior developers

## Education
**Bachelor's Degree in Computer Science**

## Languages
English (Native), Spanish (Conversational)

## Certifications
- AWS Certified Developer
- Google Analytics Certified`

const sampleCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Developer position at your company. With over 5 years of professional experience in frontend development, I am confident that my skills and background make me an excellent candidate for this role.

In my current role as a Senior Frontend Developer, I have specialized in building modern web applications using React, TypeScript, and Next.js. I have successfully led multiple projects from conception to deployment, consistently delivering high-quality solutions that exceed client expectations.

My technical expertise includes:
- Advanced proficiency in JavaScript and TypeScript
- Extensive experience with React, Next.js, and Vue.js
- Strong background in database technologies including PostgreSQL and MongoDB
- Proficiency with modern development tools and AWS cloud services

I am particularly excited about this opportunity because it aligns perfectly with my passion for creating exceptional user experiences and my expertise in modern web technologies. I believe my combination of technical skills, leadership experience, and dedication to continuous learning would make me a valuable addition to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how my experience and enthusiasm can contribute to your team's success.

Best regards,
John Doe`

export default function PDFTestPage() {
    const testResumePDF = () => {
        try {
            const resumePDFBlob = generateResumePDF(
                sampleResume,
                sampleProfile,
                { template: 'classic', fontSize: 'medium', colorScheme: 'black-white' },
                'Senior Frontend Developer'
            )

            const filename = `Test_Resume_${new Date().toISOString().split('T')[0]}.pdf`
            downloadPDF(resumePDFBlob, filename)
        } catch (error) {
            console.error('Resume PDF generation error:', error)
            alert('Error generating resume PDF: ' + error)
        }
    }

    const testCoverLetterPDF = () => {
        try {
            const coverLetterPDFBlob = generateCoverLetterPDF(
                sampleCoverLetter,
                sampleProfile,
                {
                    title: 'Senior Frontend Developer',
                    company: 'TechCorp Inc.',
                    description: 'Sample job description',
                    requirements: ['React', 'TypeScript', 'Next.js'],
                    preferredSkills: ['AWS', 'Docker', 'Git'],
                    location: 'San Francisco, CA'
                },
                { template: 'classic', fontSize: 'medium', colorScheme: 'black-white' }
            )

            const filename = `Test_CoverLetter_${new Date().toISOString().split('T')[0]}.pdf`
            downloadPDF(coverLetterPDFBlob, filename)
        } catch (error) {
            console.error('Cover letter PDF generation error:', error)
            alert('Error generating cover letter PDF: ' + error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>🧪 PDF Generator Test Page</CardTitle>
                        <CardDescription>
                            Test the PDF generation functionality with sample data
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>📄 Resume PDF Test</CardTitle>
                                    <CardDescription>
                                        Generate a sample resume PDF with test data
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <pre className="text-xs overflow-auto max-h-32">{sampleResume.substring(0, 200)}...</pre>
                                    </div>
                                    <Button onClick={testResumePDF} className="w-full">
                                        📄 Generate Resume PDF
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>💌 Cover Letter PDF Test</CardTitle>
                                    <CardDescription>
                                        Generate a sample cover letter PDF with test data
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <pre className="text-xs overflow-auto max-h-32">{sampleCoverLetter.substring(0, 200)}...</pre>
                                    </div>
                                    <Button onClick={testCoverLetterPDF} className="w-full">
                                        💌 Generate Cover Letter PDF
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>👤 Sample Profile Data</CardTitle>
                                <CardDescription>
                                    This is the sample questionnaire data used for PDF generation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sampleProfile.map((item, index) => (
                                            <div key={index} className="text-sm">
                                                <strong>{item.category}:</strong> {item.question} = {item.answer}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
