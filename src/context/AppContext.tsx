'use client'

import {
    getCurrentProfile,
    saveProfile,
    updateProfile,
    type SavedProfile
} from '@/lib/storage'
import { QuestionnaireResponse, Resume } from '@/types/resume'
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react'

interface AppState {
    currentResume: Resume | null
    questionnaireData: QuestionnaireResponse[]
    isOnboardingComplete: boolean
    currentStep: number
    currentProfile: SavedProfile | null
    isLoading: boolean
}

type AppAction =
    | { type: 'SET_RESUME'; payload: Resume }
    | { type: 'UPDATE_QUESTIONNAIRE'; payload: QuestionnaireResponse }
    | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
    | { type: 'SET_CURRENT_STEP'; payload: number }
    | { type: 'SET_CURRENT_PROFILE'; payload: SavedProfile | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'LOAD_PROFILE_DATA'; payload: { questionnaireData: QuestionnaireResponse[], isComplete: boolean } }
    | { type: 'RESET_STATE' }

const initialState: AppState = {
    currentResume: null,
    questionnaireData: [],
    isOnboardingComplete: false,
    currentStep: 0,
    currentProfile: null,
    isLoading: false
}

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_RESUME':
            return { ...state, currentResume: action.payload }
        case 'UPDATE_QUESTIONNAIRE':
            const existingIndex = state.questionnaireData.findIndex(
                q => q.question === action.payload.question
            )
            let newQuestionnaireData
            if (existingIndex >= 0) {
                const updated = [...state.questionnaireData]
                updated[existingIndex] = action.payload
                newQuestionnaireData = updated
            } else {
                newQuestionnaireData = [...state.questionnaireData, action.payload]
            }

            // Auto-save to current profile if exists
            if (state.currentProfile) {
                updateProfile(state.currentProfile.id, {
                    questionnaireData: newQuestionnaireData,
                    isComplete: newQuestionnaireData.length >= 8 // Minimum questions for completion
                })
            }

            return {
                ...state,
                questionnaireData: newQuestionnaireData
            }
        case 'SET_ONBOARDING_COMPLETE':
            return { ...state, isOnboardingComplete: action.payload }
        case 'SET_CURRENT_STEP':
            return { ...state, currentStep: action.payload }
        case 'SET_CURRENT_PROFILE':
            return { ...state, currentProfile: action.payload }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        case 'LOAD_PROFILE_DATA':
            return {
                ...state,
                questionnaireData: action.payload.questionnaireData,
                isOnboardingComplete: action.payload.isComplete
            }
        case 'RESET_STATE':
            return initialState
        default:
            return state
    }
}

const AppContext = createContext<{
    state: AppState
    dispatch: React.Dispatch<AppAction>
    saveCurrentProfile: (name: string) => SavedProfile | null
    loadProfile: (profile: SavedProfile) => void
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState)

    // Load current profile on mount
    useEffect(() => {
        const currentProfile = getCurrentProfile()
        if (currentProfile) {
            dispatch({ type: 'SET_CURRENT_PROFILE', payload: currentProfile })
            dispatch({
                type: 'LOAD_PROFILE_DATA',
                payload: {
                    questionnaireData: currentProfile.questionnaireData,
                    isComplete: currentProfile.isComplete
                }
            })
        }
    }, [])

    const saveCurrentProfile = (name: string): SavedProfile | null => {
        if (state.questionnaireData.length === 0) return null

        try {
            const newProfile = saveProfile({
                name,
                questionnaireData: state.questionnaireData,
                isComplete: state.isOnboardingComplete
            })
            dispatch({ type: 'SET_CURRENT_PROFILE', payload: newProfile })
            return newProfile
        } catch (error) {
            console.error('Error saving profile:', error)
            return null
        }
    }

    const loadProfile = (profile: SavedProfile) => {
        dispatch({ type: 'SET_CURRENT_PROFILE', payload: profile })
        dispatch({
            type: 'LOAD_PROFILE_DATA',
            payload: {
                questionnaireData: profile.questionnaireData,
                isComplete: profile.isComplete
            }
        })
    }

    return (
        <AppContext.Provider value={{
            state,
            dispatch,
            saveCurrentProfile,
            loadProfile
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
