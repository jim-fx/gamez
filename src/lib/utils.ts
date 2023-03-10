import LL from "$i18n/i18n-svelte";
import { get } from "svelte/store";

export function withSubComponents<A, B extends Record<string, any>>(
  component: A,
  subcomponents: B
): A & B {
  Object.keys(subcomponents).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)[key] = (subcomponents as any)[key];
  });
  return component as A & B;
}
export function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

export function formatTimeSpan(milliseconds: number, format: "humane" | "simple" = "humane"): string {

  const _ = get(LL);

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (format === "simple") {
    return `${days > 0 ? days + "d " : ""}${remainingHours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  if (days > 0) {
    parts.push(`${_.time.days({ days })}`);
  }

  if (remainingHours > 0) {
    parts.push(`${_.time.hours({ hours: remainingHours })}`);
  }

  if (remainingMinutes > 0) {
    parts.push(`${_.time.minutes({ minutes: remainingMinutes })}`);
  }

  if (remainingSeconds > 0) {
    parts.push(`${_.time.seconds({ seconds: remainingSeconds })}`);
  }

  if (parts.length === 0) {
    return '0 milliseconds';
  }

  return parts.join(', ');
}

export function copyToClipboard(str: string): void {
  const el = document.createElement('textarea');  // Create a temporary textarea element
  el.value = str;  // Set the value of the element to the string
  el.setAttribute('readonly', '');  // Make the element read-only to prevent user input
  el.style.position = 'absolute';  // Set the position of the element to be off-screen
  el.style.left = '-9999px';  // Move the element off-screen
  document.body.appendChild(el);  // Append the element to the document body
  el.select();  // Select the text inside the element
  document.execCommand('copy');  // Execute the copy command
  document.body.removeChild(el);  // Remove the element from the document body
}
export function compareArrays(arr1: number[], arr2: number[]) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true;
}
