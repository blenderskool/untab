import { writable } from 'svelte/store';

/**
 * Creates a basic reactive FSM. Based on XState
 * @param {Object} machine object representing the FSM
 * @returns {Writable<string>} active state
 */
export default function(machine) {
  const { subscribe, set, update } = writable(machine.initial);

  return {
    subscribe,
    send: (transition, cb=() => {}) => update((state) => {
      const nextState = machine
        .states[state]
        .on?.[transition];

      if (!nextState) return state;
      if (typeof cb === 'function') cb(nextState);

      return nextState;
    }),
    reset: () => set(machine.initial),
  };
}
