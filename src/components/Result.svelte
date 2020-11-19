<script>
  import { createEventDispatcher } from 'svelte';
  import constants from '../constants';

  export let result, isFocused = false;

  let faviconError = false;
  let element;

  const dispatch = createEventDispatcher();

  function handleSelect({ key }) {
    if (key && (key !== 'Enter' || !isFocused)) return;

    dispatch('select', result);
  }

  $: if (isFocused && element) {
    element.scrollIntoView({ block: 'nearest' });
  }

</script>

<svelte:window on:keydown={handleSelect} />

<li bind:this={element} class:is-focused={isFocused} on:click={handleSelect}>
  {#if result.favicon && !faviconError}
    <img class="favicon" src={result.favicon} alt="" on:error={() => faviconError = true}>
  {:else if result.emoji}
    <span class="emoji">{result.emoji}</span>
  {:else}
    <span class="favicon-placeholder" />
  {/if}

  <div class="info" title={result.title}> 
    <h4 class="title">{result.title}</h4> 
    <p class="url" style={!result.title ? "margin-top:0" : ""}>{result.url}</p>
  </div>
</li>


<style>
  li {
    padding: 12px 16px 12px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.1s ease;
    scroll-margin-top: 5rem;
  }
  li:hover,
  li.is-focused {
    background-color: var(--blue-400-45);
    border: 1px solid var(--blue-400);
    border-left: none;
    border-right: none;
    padding-top: 11px;
    padding-bottom: 11px;
  }

  .emoji {
    font-size: 16px;
  }

  .favicon, .favicon-placeholder, .emoji {
    width: 16px;
    margin-right: 16px;
  }
  .favicon-placeholder {
    width: 12px;
    height: 12px;
    background-color: #ED8936;
    border-radius: 100%;
  }
  li:nth-of-type(2n) .favicon-placeholder {
    background-color: #F56565;
  }
  li:nth-of-type(3n) .favicon-placeholder {
    background-color: #48BB78;
  }

  li:nth-of-type(4n) .favicon-placeholder {
    background-color: #38B2AC;
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
    color: var(--gray-700);
    margin-top: 4px;
  }
</style>