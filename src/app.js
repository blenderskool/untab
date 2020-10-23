import App from './components/App.svelte';
import constants from './constants';
import { searchVal, inputState, storedKeys } from './store';

const app = new App({
  target: document.body,
});

function close(e) {
  if (e && e.key && e.key !== 'Escape') return;

  setTimeout(() => {
    app.$set({ enabled: false });
  }, 100);
  window.parent.postMessage('', '*');
}

window.addEventListener('keydown', close);
app.$on('select', close);
window.addEventListener('message', ({ data: req }) => {
  if (req.type === constants.OPEN) {
    app.$set({ enabled: true });

    storedKeys.set(req.data.storage);
    searchVal.set({
      query: req.data.query,
      plugin: req.data.plugin,
    });

    if (req.data.plugin.name) {
      inputState.send('PLUGIN');
      inputState.send('TEXT');
    }
  }
});

window.addEventListener('click', (e) => {
  if(e.target.classList.contains("search-wrapper")) close()
})