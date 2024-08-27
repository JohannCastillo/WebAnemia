export interface Pagination{
    next: string | null;
    previous: string | null;
    page_size: number;
    count : number;
    total_pages: number;
    current_page: number;
}