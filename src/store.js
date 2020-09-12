import { writable } from 'svelte/store';

export const results = writable([]);
export const searchValue = writable('');