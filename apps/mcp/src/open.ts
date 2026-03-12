import Database from 'better-sqlite3';

export const openReadOnly = (file: string) =>
  new Database(file, { readonly: true, fileMustExist: true });
