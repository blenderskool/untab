<script>
  import { onDestroy, createEventDispatcher } from 'svelte';
  import { FrownIcon, ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from 'svelte-feather-icons';

  import Result from './Result.svelte';

  import { results, inputState, searchVal, storedKeys } from '../store';
  import keyNavArray from '../utils/keyNavArray';
  import constants from '../constants';

  let focusedIdx;

  const dispatch = createEventDispatcher();

  const port = browser.runtime.connect({ name: constants.SELECT_PORT });
  port.onMessage.addListener(({ autoClose, ...storage }) => {
    storedKeys.update((obj) => ({ ...obj, ...storage }));

    if (autoClose !== false) {
      dispatch('select');
    }
  });

  function handleSelect({ detail }) {
    port.postMessage({ data: detail });
  }

  // Reset focused result to be first result when the results get updated
  const unsubscribe = results.subscribe(() => {
    focusedIdx = keyNavArray($results);
  });

  onDestroy(() => {
    port.disconnect();
    unsubscribe();
  });
</script>

{#if $results.length}
  <ul class="results">
    {#each Object.keys($results.items) as category}
      <div style="position: relative;">
        <div class="category">{category}</div>

        {#each $results.items[category] as item}
          <Result result={item} isFocused={item.idx === $focusedIdx} on:select={handleSelect} />
        {/each}
      </div>
    {/each}
  </ul>
  <footer>
    <a href="https://paypal.me/akashhamirwasia" class="support" target="blank">
      <span style="margin-right: 2px">💙</span>
      Support UnTab
    </a>
    <span>
      <span class="hotkey">
        <ArrowUpIcon size="14" />
        <span style="margin-left: -5px">
          <ArrowDownIcon size="14" />
        </span>
        to navigate
      </span>

      <span class="hotkey">
        <CornerDownLeftIcon size="14" />
        to select
      </span>

      {#if $inputState === 'text' && !$searchVal.query.length}
        <span class="hotkey">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.8011 1.95013L2.19886 12.0498" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          for plugins
        </span>
      {/if}
    </span>
  </footer>
{:else}
  <div class="no-match">
    <span style="margin-bottom: 10px">
      <FrownIcon class="icon" size="24"/>
    </span>
    <span>
      Nothing matched the search phrase
    </span>
  </div>
{/if}

<style>
  .results {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow-y: auto;
    max-height: 60vh;
    border: 1px solid var(--border);
    border-right: none;
    border-left: none;
  }

  .results::-webkit-scrollbar {
    width: 6px;
    background-color: var(--border);
  }

  .results::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: var(--blue-400-45);
  }

  .category {
    text-transform: uppercase;
    font-weight: 600;
    padding: 6px 20px;
    font-size: 12px;
    color: var(--gray-600);
    letter-spacing: 1px;
    position: sticky;
    top: 0;
    background-color: var(--gray-300-90);
  }

  footer {
    font-size: 12px;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :global(footer svg) {
    vertical-align: middle;
    color: var(--gray-800);
  }

  footer .hotkey {
    margin-left: 8px;
    color: var(--gray-700);
    font-size: 11px;
  }

  footer .support {
    font-weight: 600;
    color: var(--gray-800);
    text-decoration: none;
  }

  .no-match {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 120px;
    font-size: 1.125rem;
    color: var(--gray-600);
    border-top: 1px solid var(--border);
  }
</style>