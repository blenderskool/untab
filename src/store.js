import { writable } from 'svelte/store';

export const results = writable({ length: 0, items: {} });
export const searchValue = writable('');