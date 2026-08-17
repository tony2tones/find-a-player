export interface Profile {
  id: string;
  created_at: string;
  name: string;
  last_name: string;
  age: number;
  location: {
    city: string;
    country: string;
  };
  skill_level: {
    overall: number;
  };
}