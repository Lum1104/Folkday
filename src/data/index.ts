import chaoshanData from './regions/chaoshan.json';
import minnanData from './regions/minnan.json';
import guangfuData from './regions/guangfu.json';
import kejiaData from './regions/kejia.json';
import {Festival, RegionId} from '../types';

const regionDataMap: Record<RegionId, Festival[]> = {
  chaoshan: chaoshanData as Festival[],
  minnan: minnanData as Festival[],
  guangfu: guangfuData as Festival[],
  kejia: kejiaData as Festival[],
};

export function getFestivalsByRegion(regionId: RegionId): Festival[] {
  return regionDataMap[regionId] || [];
}

export function getFestivalsByRegions(regionIds: RegionId[]): Festival[] {
  return regionIds.flatMap(id => getFestivalsByRegion(id));
}

export function getFestivalById(id: string): Festival | undefined {
  for (const festivals of Object.values(regionDataMap)) {
    const found = festivals.find(f => f.id === id);
    if (found) return found;
  }
  return undefined;
}
