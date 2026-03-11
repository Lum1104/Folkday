// src/types/index.ts

export interface Region {
  id: 'chaoshan' | 'minnan' | 'guangfu' | 'kejia';
  name: string;
  description: string;
}

export interface FestivalDate {
  month: number;
  day: number;
  solarTerm?: string;
}

export interface Custom {
  title: string;
  description: string;
  preparations?: string[];
  timing?: string;
}

export interface Festival {
  id: string;
  name: string;
  region: Region['id'];
  calendarType: 'lunar' | 'solar' | 'solarTerm';
  date: FestivalDate;
  importance: 'high' | 'medium' | 'low';
  customs: Custom[];
  description: string;
  tags: string[];
}

export interface UserPreferences {
  selectedRegions: Region['id'][];
  reminderEnabled: boolean;
  reminderDays: {
    high: number;
    medium: number;
    low: number;
  };
  reminderTime: string; // "HH:mm" format
}

export interface DayFestivalInfo {
  date: string; // "YYYY-MM-DD"
  lunarDate: string;
  lunarMonth: string;
  lunarDay: string;
  festivals: Festival[];
  solarTerm?: string;
}

export type RegionId = Region['id'];

export const REGION_LIST: Region[] = [
  { id: 'chaoshan', name: '潮汕', description: '潮州、汕头、揭阳及周边地区' },
  { id: 'minnan', name: '闽南', description: '厦门、泉州、漳州等福建南部地区' },
  { id: 'guangfu', name: '广府', description: '广州、佛山、顺德等珠三角粤语区' },
  { id: 'kejia', name: '客家', description: '梅州、河源、惠州、龙岩、赣州等客家聚居区' },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  selectedRegions: ['chaoshan', 'minnan', 'guangfu', 'kejia'],
  reminderEnabled: true,
  reminderDays: { high: 3, medium: 1, low: 0 },
  reminderTime: '09:00',
};
