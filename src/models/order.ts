import { Resource } from './resource';

export interface FulfilledResources extends Partial<Resource> {
  unfulfilled?: Partial<Resource>;
}

export interface Order {
  id: string;
  day: number;
  fulfilled: FulfilledResources; //This is an object conforming to the FulfilledResources interface, meaning it includes the fulfilled quantities of each resource and optionally any unfulfilled resources.
}