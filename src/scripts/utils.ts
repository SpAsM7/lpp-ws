// Utility functions for generating test data

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateCompanyName(): string {
  const prefixes = ['Global', 'Advanced', 'Strategic', 'Premier', 'Elite', 'Innovative'];
  const mids = ['Tech', 'Solutions', 'Systems', 'Ventures', 'Capital', 'Partners'];
  const suffixes = ['Corp', 'Inc', 'LLC', 'Group', 'Holdings'];
  
  return `${randomChoice(prefixes)} ${randomChoice(mids)} ${randomChoice(suffixes)}`;
}

export function generatePersonName(): string {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  return `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
}

export function generateSSN(): string {
  // Generate a fake SSN in format XXX-XX-XXXX
  const area = Math.floor(Math.random() * 900) + 100;
  const group = Math.floor(Math.random() * 90) + 10;
  const serial = Math.floor(Math.random() * 9000) + 1000;
  
  return `${area}-${group}-${serial}`;
}

export function generateEIN(): string {
  // Generate a fake EIN in format XX-XXXXXXX
  const prefix = Math.floor(Math.random() * 90) + 10;
  const suffix = Math.floor(Math.random() * 9000000) + 1000000;
  
  return `${prefix}-${suffix}`;
}

// Special wrapper for UUID values to distinguish them in SQL generation
export class SQLUUIDValue {
  constructor(public value: string) {}
  toString() {
    return this.value;
  }
}

export function escapeSQL(value: any): string {
  if (value === null) return 'NULL';
  if (value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return value.toString();
  if (value instanceof Date) return `'${value.toISOString()}'`;
  if (value instanceof SQLUUIDValue) return `'${value.value}'::uuid`;
  if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  if (typeof value !== 'string') return `'${String(value)}'`;
  
  // Check if the string is a UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(value)) {
    return `'${value}'::uuid`;  // Add UUID cast for raw UUID strings
  }
  
  return `'${value.replace(/'/g, "''")}'`;
}
