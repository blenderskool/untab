<script>
  import Result from './Result.svelte';

  import { results } from '../store';

  let focusedIdx = 0;

  function handleKeyNav(e) {

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusedIdx = (focusedIdx + 1) % $results.length;
        break;

      case 'ArrowUp':
        e.preventDefault();
        focusedIdx = ($results.length + focusedIdx - 1) % $results.length;
        break;

      default:
        break;
    }
  }

</script>

<svelte:window on:keydown={handleKeyNav} />

{#if $results.length}
  <ul class="results">
    {#each $results as { item }, i}
      <Result result={item} isFocused={i === focusedIdx} on:select />
    {/each}
  </ul>
{/if}

<style>
  .results {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow-y: auto;
    max-height: 60vh;
    border-top: 1px solid #CECECE;
  }
</style>