export const newArray = <T>(length: number, callback: (index: number) => T) =>
  Array.from({ length }, (_, i) => callback(i));

export const toKeyValueObject = <T extends string>(array: T[]) =>
  array.reduce(
    (acc, value) => {
      acc[value] = value;
      return acc;
    },
    {} as Record<T, T>,
  );
