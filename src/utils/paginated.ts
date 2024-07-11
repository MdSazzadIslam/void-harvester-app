import { Paginate, Resource } from '../models'

export const paginatedData = (data: Omit<Resource, 'day'>[], page: number, size: number): Paginate => {
    const pageIndex = page - 1;
    const start = pageIndex * size;
    const end = start + size;

    const result = data.slice(start, end)

    return {
        total: data.length,
        page,
        size: size,
        totalPages: Math.ceil(data.length / size),
        data: result
    }
}