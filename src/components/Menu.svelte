<script>
  import { createEventDispatcher } from 'svelte';
  import keyNavArray from '../utils/keyNavArray';

  export let items;
  let activeIdx;

  const dispatch = createEventDispatcher();

  $: activeIdx = keyNavArray(items);

  function handleSelect({ key }) {
    if (key !== 'Enter') return;

    dispatch('select', items[$activeIdx]);
  }

</script>

<svelte:window on:keydown={handleSelect} />

<div class="menu {$$props.class || ''}">
  <ul>
    {#each items as item, i}
      <li class:active={$activeIdx === i}>
        <slot item={item} />
      </li>
    {/each}
  </ul>
</div>

<style>

  .menu {
    padding: 4px;
    background-color: var(--bg);
    position: absolute;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .menu ul {
    margin: 0;
    list-style: none;
    padding: 0;
  }

  .menu ul li {
    padding: 6px 8px;
    white-space: nowrap;
    border-radius: 4px;
    margin: 2px 0;
    line-height: 1;
    font-weight: 600;
    font-size: 15px;
  }

  .menu ul li.active {
    background-color: var(--blue-400-45);
  }

</style>