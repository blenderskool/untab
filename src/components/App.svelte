<script>
  import { fade } from 'svelte/transition';
  import Results from './Results.svelte';

  import { results } from '../store';
  import constants from '../constants';

  export let enabled = false;
  let input, port;

  function search() {
    port.postMessage({ data: input.value });
  }

  $: if (enabled) {
    setTimeout(() => {
      input.focus();
    }, 101);

    if (port === undefined) {
      port = chrome.runtime.connect({ name: constants.SEARCH_PORT });
      port.onMessage.addListener((response) => {
        results.set(response);
      });
    }
  }
</script>

{#if enabled}
  <div class="search-wrapper" transition:fade="{{ duration: 100 }}">
    <div class="search">
      <input
        type="search"
        placeholder="Search Tab..."
        bind:this={input}
        on:input={search}
      >
      <Results />
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
    justify-content: center;
    align-items: self-end;
  }

  .search {
    background-color: #fff;
    position: relative;
    top: 90px;
    width: 750px;
    border-radius: 10px;
    overflow: hidden;
  }

  .search input {
    width: 100%;
    border: none;
    outline: none;
    height: 50px;
    padding: 0 16px;
    font-weight: 700;
    font-size: 1.2rem;
  }
</style>