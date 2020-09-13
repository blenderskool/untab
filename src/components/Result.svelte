<script>
  import { createEventDispatcher } from 'svelte';
  import constants from '../constants';

  export let result, isFocused = false;

  let faviconError = false;
  let element;

  const dispatch = createEventDispatcher();

  function handleSelect({ key }) {
    if (key && (key !== 'Enter' || !isFocused)) return;

    chrome.runtime.sendMessage({
      type: constants.SELECT,
      data: result,
    }, () =>dispatch('select'));
  }

  $: if (isFocused && element) {
    element.scrollIntoView({ block: 'nearest' });
  }

</script>

<svelte:window on:keydown={handleSelect} />

<li bind:this={element} class:is-focused={isFocused} on:click={handleSelect}>
  {#if result.favicon && !faviconError}
    <img class="favicon" src={result.favicon} alt="" on:error={() => faviconError = true}>
  {:else}
    <span class="favicon-placeholder" />
  {/if}

  <div class="info" title={result.title}>
    <h4 class="title">{result.title}</h4>
    <p class="url">{result.url}</p>
  </div>
</li>


<style>
  li {
    padding: 12px 16px 12px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.1s ease;
  }
  li:hover,
  li.is-focused {
    background-color: rgba(99, 179, 237, 0.45);
    border: 1px solid #63B3ED;
    border-left: none;
    border-right: none;
    padding-top: 11px;
    padding-bottom: 11px;
  }

  .favicon, .favicon-placeholder {
    width: 16px;
    margin-right: 16px;
  }
  .favicon-placeholder {
    width: 12px;
    height: 12px;
    background-color: #ED8936;
    border-radius: 100%;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow-x: hidden;
  }

  .title, .url {
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }

  .url {
    font-size: 12px;
    color: #4A5568;
    margin-top: 4px;
  }
</style>