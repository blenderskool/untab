<script>
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import Menu from '../Menu.svelte';
  import ContextIndicator from './ContextIndicator.svelte';
  import Pill from './Pill.svelte';

  import constants from '../../constants';
  import { results, searchVal, inputState } from '../../store';

  let input, suggestion = '';

  const port = chrome.runtime.connect({ name: constants.SEARCH_PORT });
  port.onMessage.addListener((response) => {
    results.set(response);

    const { match } = response;
    if (Array.isArray(match) && match.length) {
      const firstMatch = match[0];
      const index = firstMatch.indices[firstMatch.indices.length - 1];
      suggestion = firstMatch.value.substring(index[1] + 1);
    } else {
      suggestion = '';
    }
  });


  function search(val) {
    const { query } = val;

    if (!query) {
      suggestion = '';
    } else {
      /**
       * After a character is typed, first character from suggestion is removed
       * as there is a small delay in getting new suggestion 
       */
      suggestion = suggestion.substring(1);
    }

    inputState.send(
      query.startsWith('/') ? 'PLUGIN' : 'BACK',
      () => results.reset(),
    );

    /**
     * get() is used here instead of $ because $ does not get latest value inside
     * a subscription function.
     * 
     * TODO:
     * Track this issue here and fix accordingly
     * https://github.com/sveltejs/svelte/issues/5052
     */
    switch(get(inputState)) {
      case 'plugin':
        port.postMessage({
          type: constants.SEARCH_TYPE_PLUGINS,
          data: val,
        });
        break;
      case 'pluginText':
        port.postMessage({
          type: constants.SEARCH_TYPE_PLUGIN,
          data: val,
        });
        break;
      case 'text':
        port.postMessage({
          type: constants.SEARCH_TYPE_FULL,
          data: val,
        });
    }
  }

  function handleKey({ key }) {

    switch (key) {
      case 'ArrowRight':
        const { selectionStart, selectionEnd } = input;
        if (selectionEnd === selectionStart && selectionStart === $searchVal.query.length) {
          searchVal.update(s => ({ ...s, query: s.query + suggestion }));
          suggestion = '';
        }
        break;

      case 'Backspace':
        if (!$searchVal.query.length) {
          // CLEAR transition takes back to 'text' state
          inputState.send('CLEAR', () => results.reset());
          searchVal.reset();
        }
        break;
    
      default:
        break;
    }
  }

  function handlePluginSelect({ detail:plugin }) {
    inputState.send('TEXT');
    searchVal.set({ query: '', plugin });
  }

  onMount(() => {
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);
  });

  const unsubscribe = searchVal.subscribe(search);
  onDestroy(unsubscribe);

</script>

<div class="input-wrapper">
  <ContextIndicator />

  <div class="highlight">
    <div style="visibility: hidden">
      <ContextIndicator />
    </div>

    <span class="text">{$searchVal.query}</span>

    {#if $inputState === 'plugin' && $results.length}
      <Menu
        class="menu"
        items={Object.values($results.items)}
        on:select={handlePluginSelect}
        let:item={item}
      >
        {item.displayName}
      </Menu>
    {/if}

    <span class="hint">{suggestion}</span>
  </div>

  <input
    type="text"
    placeholder="Search Tab"
    bind:this={input}
    bind:value={$searchVal.query}
    on:keydown={handleKey}
  />

  {#if $results.length}
    <Pill style="margin-left: 8px;">
      {$results.length} {$results.length > 1 ? 'results' : 'result'}
    </Pill>
  {/if}
</div>

<style>
  .input-wrapper {
    padding: 0 16px;
    height: 52px;
    display: flex;
    align-items: center;
  }

  .input-wrapper input {
    padding: 0;
    position: relative;
    z-index: 1;
    background-color: transparent;
    width: 100%;
    border: none;
    outline: none;
    font-size: 1.2rem;
    color: var(--gray-800);
  }
  .input-wrapper input::placeholder {
    color: var(--gray-600);
  }

  .highlight {
    position: absolute;
    left: 16px;
    display: flex;
    max-width: 83%;
    white-space: nowrap;
  }

  .highlight .text {
    position: relative;
    visibility: hidden;
  }

  .highlight .hint,
  .highlight .text {
    white-space: pre;
    font-size: 1.2rem;
    color: var(--gray-600);
    line-height: 52px;
    pointer-events: none;
  }

  .highlight .hint {
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .highlight :global(.menu) {
    top: 100%;
    left: 100%;
  }

  :global(.icon) {
    color: var(--gray-500);
    vertical-align: middle;
  }
</style>