export interface Metadata {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResponse<T>{
    items : T;
    metadata: Metadata;

    constructor(items: T, metadata: Metadata) {
        this.items = items;
        this.metadata = metadata;
    }
}