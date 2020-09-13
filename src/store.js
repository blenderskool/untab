import { writable } from 'svelte/store';

export const results = writable({ items: [] });
export const searchValue = writable('');