<script>
  import constants from '../constants';
  import { fade } from 'svelte/transition';

  export let enabled = false;
  let input;
  let port;
  let searchResults = [];

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
        searchResults = response;
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
      <ul class="results">
        {#each searchResults as { item }}
          <li>
            {item.title}
          </li>
        {/each}
      </ul>
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

  .results {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .results li {
    padding: 12px 16px;
  }
</style>