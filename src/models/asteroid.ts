export type AsteroidType = 'C' | 'S' | 'M' | 'V';

export interface Asteroid {
  name: string;
  type: AsteroidType;
  mass: number; // in millions of tons
}