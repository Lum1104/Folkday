// src/contexts/AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, RegionId, DEFAULT_PREFERENCES } from '../types';

interface AppState {
  preferences: UserPreferences;
  selectedDate: string | null; // "YYYY-MM-DD"
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_PREFERENCES'; payload: UserPreferences }
  | { type: 'TOGGLE_REGION'; payload: RegionId }
  | { type: 'SET_SELECTED_DATE'; payload: string | null }
  | { type: 'SET_REMINDER_ENABLED'; payload: boolean }
  | { type: 'SET_REMINDER_DAYS'; payload: { importance: 'high' | 'medium' | 'low'; days: number } }
  | { type: 'SET_REMINDER_TIME'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  preferences: DEFAULT_PREFERENCES,
  selectedDate: null,
  isLoading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload, isLoading: false };
    case 'TOGGLE_REGION': {
      const regions = state.preferences.selectedRegions;
      const newRegions = regions.includes(action.payload)
        ? regions.filter(r => r !== action.payload)
        : [...regions, action.payload];
      return {
        ...state,
        preferences: { ...state.preferences, selectedRegions: newRegions },
      };
    }
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_REMINDER_ENABLED':
      return {
        ...state,
        preferences: { ...state.preferences, reminderEnabled: action.payload },
      };
    case 'SET_REMINDER_DAYS':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          reminderDays: {
            ...state.preferences.reminderDays,
            [action.payload.importance]: action.payload.days,
          },
        },
      };
    case 'SET_REMINDER_TIME':
      return {
        ...state,
        preferences: { ...state.preferences, reminderTime: action.payload },
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const STORAGE_KEY = 'user_preferences';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validate shape: merge with defaults and check critical fields
          const merged = {
            ...DEFAULT_PREFERENCES,
            ...parsed,
            reminderDays: { ...DEFAULT_PREFERENCES.reminderDays, ...(parsed.reminderDays || {}) },
          };
          const isValid =
            Array.isArray(merged.selectedRegions) &&
            typeof merged.reminderEnabled === 'boolean' &&
            typeof merged.reminderDays === 'object' &&
            merged.reminderDays !== null &&
            typeof merged.reminderTime === 'string';
          dispatch({
            type: 'SET_PREFERENCES',
            payload: isValid ? merged : DEFAULT_PREFERENCES,
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      try {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.preferences)).catch(
          (error: unknown) => console.error('Failed to persist preferences:', error)
        );
      } catch (error) {
        console.error('Failed to persist preferences:', error);
      }
    }
  }, [state.preferences, state.isLoading]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
