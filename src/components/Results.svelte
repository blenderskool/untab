<script>
  import { onDestroy } from 'svelte';
  import Result from './Result.svelte';

  import { results } from '../store';

  let focusedIdx = 0;

  // Resest focused result to be first result when the results get updated
  const unsubscribe = results.subscribe(() => {
    focusedIdx = 0;
  });

  function handleKeyNav(e) {

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusedIdx = (focusedIdx + 1) % $results.items.length;
        break;

      case 'ArrowUp':
        e.preventDefault();
        focusedIdx = ($results.items.length + focusedIdx - 1) % $results.items.length;
        break;

      default:
        break;
    }
  }

  onDestroy(unsubscribe);

</script>

<svelte:window on:keydown={handleKeyNav} />

{#if $results.items.length}
  <ul class="results">
    {#each $results.items as item, i}
      {#if i === 0 || item.category !== $results.items[i-1].category}
        <div class="category">{item.category}</div>
      {/if}

      <Result result={item} isFocused={i === focusedIdx} on:select />
    {/each}
  </ul>
  <footer>
    <span>
      {$results.items.length} results
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
  }

  footer {
    font-size: 12px;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
  }
</style>