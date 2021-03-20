<script>
  import Results from './Results.svelte';
  import Input from './Input/Input.svelte';

  import { results, inputState, storedKeys } from '../store';
  import constants from '../constants';

  export let enabled = false;
</script>

{#if enabled}
  <div class={`search-wrapper ${$storedKeys.theme ? 'theme-'+$storedKeys.theme : ''}`}>
    <div class="search">

      <Input />

      {#if $inputState !== 'plugin'}
        <Results on:select />
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(body) {
    font-size: 16px;
  }

  :global(*) {
    box-sizing: border-box;
    font-family: 'Lato', sans-serif;
  }

  .search-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--gray-800);
  }

  .search {
    background-color: var(--bg-80);
    border: 1px solid var(--border);
    position: relative;
    top: 90px;
    width: 75%;
    max-width: 620px;
    min-height: 50px;
    max-height: 80vh;
    border-radius: 5px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  @supports (backdrop-filter: blur(15px) saturate(2)) {
    .search {
      backdrop-filter: blur(15px) saturate(2);
    }
  }
</style>