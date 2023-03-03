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

export function formatTimeSpan(milliseconds: number): string {

  const _ = get(LL);

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const parts = [];

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
