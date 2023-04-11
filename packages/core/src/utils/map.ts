/* eslint-disable @typescript-eslint/no-explicit-any */

type MappedValues<T, U> = {
  [K in keyof T]: U;
};

export function mapObject<T extends object, U>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T) => U
): MappedValues<T, U> {
  const result = {} as MappedValues<T, U>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const typedKey = key as keyof T;
      const value = obj[typedKey];
      result[typedKey] = callback(value, typedKey);
    }
  }

  return result;
}
