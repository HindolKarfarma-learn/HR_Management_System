export const simulateLatency = (delay = 350) => new Promise((resolve) => setTimeout(resolve, delay));
export const copy = (value) => structuredClone(value);

export function sortRecords(records, sort) {
  if (!sort?.key) return records;
  const direction = sort.direction === 'desc' ? -1 : 1;
  return [...records].sort((a, b) => String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? ''), undefined, { numeric: true }) * direction);
}

export function paginate(records, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return {
    items: records.slice(start, start + pageSize),
    total: records.length,
    page,
    pageSize,
    totalPages: Math.ceil(records.length / pageSize),
  };
}
