<script>
  import { onDestroy } from 'svelte';
  import Result from './Result.svelte';

  import { FrownIcon } from 'svelte-feather-icons'

  import { results } from '../store';
  import keyNavArray from '../utils/keyNavArray';

  let focusedIdx;

  // Reset focused result to be first result when the results get updated

  const unsubscribe = results.subscribe(() => {
    focusedIdx = keyNavArray($results);
  });

  onDestroy(unsubscribe);
</script>

{#if $results.length}
  <ul class="results">
    {#each Object.keys($results.items) as category}
      <div style="position: relative;">
        <div class="category">{category}</div>

        {#each $results.items[category] as item}
          <Result result={item} isFocused={item.idx === $focusedIdx} on:select />
        {/each}
      </div>
    {/each}
  </ul>
  <footer>
    <span>
      {$results.length} {#if $results.length>1} results {:else} result{/if}
    </span>
    <span>
      ↑ and ↓ to navigate, ↲ to select
    </span>
  </footer>
{:else}
  <div class ="no-match">
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
    border: 1px solid var(--border-col);
    border-right: none;
    border-left: none;
  }

  .results::-webkit-scrollbar {
    width: 6px;
    background-color: var(--border-col);
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
  }

.no-match {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  font-size: 18px;
  color: var(--gray-600);
  border-top: 1px solid var(--border-col);
}
</style>