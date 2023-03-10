import localStore from "./localStore";

export const settings = localStore<{
  theme: 'light' | 'dark' | "auto";
}>("settings/v2", { theme: "auto" })

settings.subscribe((settings) => {
  if ("cookies" in globalThis) {
    document.cookie = `theme=${settings.theme}; path=/; max-age=31536000;`;
  }
});
