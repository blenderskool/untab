<script>
  import { onDestroy } from 'svelte';
  import Result from './Result.svelte';

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
{/if}

<style>
  .results {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow-y: auto;
    max-height: 60vh;
    border: 1px solid #CECECE;
    border-right: none;
    border-left: none;
  }

  .category {
    text-transform: uppercase;
    font-weight: 600;
    padding: 6px 20px;
    font-size: 12px;
    color: #718096;
    letter-spacing: 1px;
    position: sticky;
    top: 0;
    background-color: rgba(240, 240, 240, 0.9);
  }

  footer {
    font-size: 12px;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
  }
</style>