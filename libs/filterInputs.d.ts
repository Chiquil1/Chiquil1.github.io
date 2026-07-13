export interface Filters {
    [key: string]: string | number | boolean | any[];
}
export declare function createFilter(filterDefinition: Record<string, any>): Filters;
export declare function applyFilters(filters: Filters | undefined): Filters;
