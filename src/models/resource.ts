export interface Resource {
  day: number
  nickel: number;
  iron: number;
  cobalt: number;
  water: number;
  nitrogen: number;
  ammonia: number;
}

export interface Composition {
  [type: string]: Partial<Resource>;
}
