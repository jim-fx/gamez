import localStore from "$lib/localStore";

export const currentLevel = localStore('sokoban-current-level', 0);

export const savedGames = localStore<{ [hash: string]: { rating: number; createdAt: number } }>(
  'sokoban-saved-games',
  {}
);
