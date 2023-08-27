export interface Response<T> {
    statut: number,
    message: string,
    data: T[]
}