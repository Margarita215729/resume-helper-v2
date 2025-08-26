import { QuestionnaireResponse } from '@/types/resume'

export interface SavedProfile {
    id: string
    name: string
    createdAt: string
    lastModified: string
    questionnaireData: QuestionnaireResponse[]
    isComplete: boolean
}

export interface GeneratedDocument {
    id: string
    type: 'resume' | 'cover-letter'
    title: string
    content: string
    jobTitle?: string
    company?: string
    createdAt: string
    profileId: string
}

const STORAGE_KEYS = {
    PROFILES: 'resume-helper-profiles',
    DOCUMENTS: 'resume-helper-documents',
    CURRENT_PROFILE: 'resume-helper-current-profile'
}

// Profile Management
export const saveProfile = (profile: Omit<SavedProfile, 'id' | 'createdAt' | 'lastModified'>): SavedProfile => {
    const profiles = getProfiles()
    const now = new Date().toISOString()

    const newProfile: SavedProfile = {
        ...profile,
        id: crypto.randomUUID(),
        createdAt: now,
        lastModified: now
    }

    profiles.push(newProfile)
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles))

    return newProfile
}

export const updateProfile = (profileId: string, updates: Partial<SavedProfile>): SavedProfile | null => {
    const profiles = getProfiles()
    const profileIndex = profiles.findIndex(p => p.id === profileId)

    if (profileIndex === -1) return null

    const updatedProfile: SavedProfile = {
        ...profiles[profileIndex],
        ...updates,
        lastModified: new Date().toISOString()
    }

    profiles[profileIndex] = updatedProfile
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles))

    return updatedProfile
}

export const getProfiles = (): SavedProfile[] => {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.PROFILES)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Error loading profiles:', error)
        return []
    }
}

export const getProfile = (profileId: string): SavedProfile | null => {
    const profiles = getProfiles()
    return profiles.find(p => p.id === profileId) || null
}

export const deleteProfile = (profileId: string): boolean => {
    const profiles = getProfiles()
    const filteredProfiles = profiles.filter(p => p.id !== profileId)

    if (filteredProfiles.length === profiles.length) return false

    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(filteredProfiles))

    // Also remove associated documents
    const documents = getDocuments()
    const filteredDocuments = documents.filter(d => d.profileId !== profileId)
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filteredDocuments))

    // Clear current profile if it's the deleted one
    const currentProfileId = getCurrentProfileId()
    if (currentProfileId === profileId) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PROFILE)
    }

    return true
}

// Current Profile Management
export const setCurrentProfile = (profileId: string): void => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, profileId)
}

export const getCurrentProfileId = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE)
}

export const getCurrentProfile = (): SavedProfile | null => {
    const profileId = getCurrentProfileId()
    return profileId ? getProfile(profileId) : null
}

// Document Management
export const saveDocument = (document: Omit<GeneratedDocument, 'id' | 'createdAt'>): GeneratedDocument => {
    const documents = getDocuments()

    const newDocument: GeneratedDocument = {
        ...document,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
    }

    documents.push(newDocument)
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents))

    return newDocument
}

export const getDocuments = (profileId?: string): GeneratedDocument[] => {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS)
        const documents = stored ? JSON.parse(stored) : []

        return profileId
            ? documents.filter((d: GeneratedDocument) => d.profileId === profileId)
            : documents
    } catch (error) {
        console.error('Error loading documents:', error)
        return []
    }
}

export const getDocument = (documentId: string): GeneratedDocument | null => {
    const documents = getDocuments()
    return documents.find(d => d.id === documentId) || null
}

export const deleteDocument = (documentId: string): boolean => {
    const documents = getDocuments()
    const filteredDocuments = documents.filter(d => d.id !== documentId)

    if (filteredDocuments.length === documents.length) return false

    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filteredDocuments))
    return true
}

// Import/Export functionality
export const exportProfile = (profileId: string): string => {
    const profile = getProfile(profileId)
    if (!profile) throw new Error('Profile not found')

    const documents = getDocuments(profileId)

    const exportData = {
        profile,
        documents,
        exportedAt: new Date().toISOString(),
        version: '1.0'
    }

    return JSON.stringify(exportData, null, 2)
}

export const importProfile = (exportData: string): SavedProfile => {
    try {
        const data = JSON.parse(exportData)

        if (!data.profile || !data.version) {
            throw new Error('Invalid export data format')
        }

        // Create new profile with new ID
        const importedProfile = saveProfile({
            name: `${data.profile.name} (Imported)`,
            questionnaireData: data.profile.questionnaireData,
            isComplete: data.profile.isComplete
        })

        // Import documents if they exist
        if (data.documents && Array.isArray(data.documents)) {
            data.documents.forEach((doc: Partial<GeneratedDocument>) => {
                if (doc.type && doc.title && doc.content) {
                    saveDocument({
                        type: doc.type,
                        title: doc.title,
                        content: doc.content,
                        jobTitle: doc.jobTitle,
                        company: doc.company,
                        profileId: importedProfile.id
                    })
                }
            })
        }

        return importedProfile
    } catch (error) {
        console.error('Import error:', error)
        throw new Error('Failed to import profile data')
    }
}

// Storage cleanup and utilities
export const clearAllData = (): void => {
    localStorage.removeItem(STORAGE_KEYS.PROFILES)
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PROFILE)
}

export const getStorageStats = () => {
    const profiles = getProfiles()
    const documents = getDocuments()

    return {
        profileCount: profiles.length,
        documentCount: documents.length,
        storageSize: {
            profiles: JSON.stringify(profiles).length,
            documents: JSON.stringify(documents).length
        }
    }
}
