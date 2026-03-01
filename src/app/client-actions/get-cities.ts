import { $fetchC } from '@/src/app/client-api/model';

export interface City {
  id: number;
  name: string;
  photo_url: string | null;
  links: { id: string; name: string; url: string }[];
  created_at: string;
  updated_at: string;
}

export interface CitiesResponse {
  data: {
    rows: City[];
    count: number;
  };
}

export const citiesModel = {
  getCities: async (): Promise<CitiesResponse> => {
    const response = await $fetchC('cities?hasPhoto=true', { method: 'GET' });
    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }

    return response.json();
  },
};
