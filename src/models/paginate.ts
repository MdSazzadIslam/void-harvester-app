import { Resource } from './resource'

export interface Paginate {
    total: number,
    page: number,
    size: number,
    totalPages: number
    data: Omit<Resource, 'day'>[]
}