<script>
  import Result from './Result.svelte';

  import { results } from '../store';
</script>

{#if $results.length}
  <ul class="results">
    {#each $results as { item }}
      <Result result={item} on:select />
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