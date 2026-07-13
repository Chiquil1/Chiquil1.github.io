export interface Filters {
  [key: string]: string | number | boolean | any[];
}

export function createFilter(filterDefinition: Record<string, any>): Filters {
  return filterDefinition;
}

export function applyFilters(filters: Filters | undefined): Filters {
  return filters || {};
}