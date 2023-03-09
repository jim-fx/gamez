declare global {
  function umami(eventName: string, options?: Record<string, unknown>): void;
}

export default function(eventName: string, options?: Record<string, unknown>) {
  if ("umami" in globalThis) {
    window.umami(eventName, options);
  }
}
