import Fuse from 'fuse.js';

export default class extends Fuse {
  constructor(list, ...args) {
    super(list, ...args);
    this.items = list.map(item => ({ item, score: 1 }));
  }

  search(pattern, ...args) {
    if (!pattern) return this.items;

    return super.search(pattern, ...args);
  }
};