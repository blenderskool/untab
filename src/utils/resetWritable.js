import { writable } from 'svelte/store';

/**
 * Creates a writable with a reset method to reset it to initial value
 * @param {Object} initial initial value for the store
 * @returns {Writable<Object>}
 */
export default function(initial = {}) {
  const { subscribe, set, update } = writable({ ...initial });
  
  return {
    subscribe,
    set,
    update,
    reset: () => set({ ...initial }),
  };
}