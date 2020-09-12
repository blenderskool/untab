<script>
  import { onMount } from 'svelte';
  import { SearchIcon, XIcon } from 'svelte-feather-icons';

  import constants from '../constants';
  import { results, searchValue } from '../store';

  let input;

  const port = chrome.runtime.connect({ name: constants.SEARCH_PORT });
  port.onMessage.addListener((response) => {
    results.set(response);
  });

  function search() {
    port.postMessage({ data: $searchValue });
  }

  function clear() {
    searchValue.set('');
    input.focus();
  }

  onMount(() => {
    setTimeout(() => {
      input.focus();
    }, 101);
  });

</script>

<div class="input-wrapper">
  <span style="margin-right: 8px">
    <SearchIcon class="icon" size="22" />
  </span>

  <input
    type="text"
    placeholder="Search Tab..."
    bind:this={input}
    bind:value={$searchValue}
    on:input={search}
  >

  {#if $searchValue}
    <span style="cursor: pointer" on:click={clear}>
      <XIcon class="icon" size="20" />
    </span>
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
    background-color: transparent;
    width: 100%;
    border: none;
    outline: none;
    font-size: 1.2rem;
    color: #2D3748;
  }
  .input-wrapper input::placeholder {
    color: #718096;
  }

  :global(.icon) {
    color: #A0AEC0;
    vertical-align: middle;
  }
</style>