import { readable } from 'svelte/store';

/**
 * Up and Down Keyboard navigation over an array
 * @param {Array} items Items for navigation
 * @param {number} initial Initial selected index
 * @returns {Readable<number>} returns a readable for the active index
 */
export default function(items, initial = 0) {
  let activeIdx = initial;

  return readable(activeIdx, (set) => {
    const handleKeyNav = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          activeIdx = (activeIdx + 1) % items.length;
          break;

        case 'ArrowUp':
          e.preventDefault();
          activeIdx = (items.length + activeIdx - 1) % items.length;
          break;

        default:
          break;
      }
      set(activeIdx);
    };

    window.addEventListener('keydown', handleKeyNav);

    return () => window.removeEventListener('keydown', handleKeyNav);
  });
}