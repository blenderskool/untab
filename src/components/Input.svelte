<script>
  import { onMount } from 'svelte';
  import { SearchIcon, XIcon } from 'svelte-feather-icons';

  import constants from '../constants';
  import { results, searchValue } from '../store';

  let input, suggestion = '';

  const port = chrome.runtime.connect({ name: constants.SEARCH_PORT });
  port.onMessage.addListener((response) => {
    results.set(response);

    const { match } = response;
    if (Array.isArray(match) && match.length) {
      const firstMatch = match[0];
      const index = firstMatch.indices[firstMatch.indices.length - 1];
      suggestion = firstMatch.value.substring(index[1] + 1);
    } else {
      suggestion = '';
    }
  });

  function search() {
    if (!$searchValue) {
      suggestion = '';
    }

    port.postMessage({ data: $searchValue });
  }

  function clear() {
    suggestion = '';
    searchValue.set('');
    input.focus();
    search();
  }

  function handleKey(e) {
    if (e.key !== 'ArrowRight') return;

    const { selectionStart, selectionEnd } = input;
    if (selectionEnd === selectionStart && selectionStart === $searchValue.length) {
      e.stopPropagation();
      searchValue.update(s => s + suggestion);
      suggestion = '';
    }
  }

  onMount(() => {
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    search();
  });

</script>

<div class="input-wrapper">
  <span style="margin-right: 8px">
    <SearchIcon class="icon" size="22" />
  </span>

  <input
    type="text"
    placeholder="Search Tab"
    bind:this={input}
    bind:value={$searchValue}
    on:input={search}
    on:keydown={handleKey}
  />

  <div class="highlight">
    <span style="visibility: hidden;white-space: pre;">{$searchValue}</span><span>{suggestion}</span>
  </div>

  {#if $searchValue}
    <span style="cursor: pointer;" on:click={clear}>
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

  .highlight {
    position: absolute;
    left: 48px;
    font-size: 1.2rem;
    color: #718096;
    flex: 1;
    max-width: 87%;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    line-height: 52px;
    pointer-events: none;
  }

  :global(.icon) {
    color: #A0AEC0;
    vertical-align: middle;
  }
</style>