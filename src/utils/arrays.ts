export const newArray = <T>(length: number, callback: (index: number) => T) =>
  Array.from({ length }, (_, i) => callback(i));
