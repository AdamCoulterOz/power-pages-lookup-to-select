import { Transform } from 'class-transformer';

const msDateRe = /^\/Date\((\d+)(?:[+-]\d+)?\)\/$/;

export function MsDate() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const m = msDateRe.exec(value);
    return m ? new Date(Number(m[1])) : value;
  });
}