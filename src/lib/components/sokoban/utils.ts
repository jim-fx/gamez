import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

export function compare<T>(a: T[], b: T[]) {
  for (const i in a) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function arrayToMap<T>(arr: T[]) {
  const map = new Map();
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    map.set(element, index);
  }
  return map;
}

const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
export function compressArray(arr: number[]) {
  return compressToEncodedURIComponent(arr.map((n) => chars[n]).join(""));
}

export function decompressArray(str: string) {
  return decompressFromEncodedURIComponent(str).split("").map((c: string) => chars.indexOf(c));
}
