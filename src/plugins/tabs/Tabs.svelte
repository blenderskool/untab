<script>
  import { Button } from '@untab/plugins-ui';
  import { XIcon } from 'svelte-feather-icons';

  export let item, event;
</script>

<Button on:click={() => event('togglePin', item.id, !item.pinned)} title="Toggle tab pin on/off">
  {#if item.pinned}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h24v24H0z" stroke="none"/><path d="M3 3l18 18M15 4.5l-3.249 3.249m-2.57 1.433L7 10l-1.5 1.5 7 7L14 17l.82-2.186m1.43-2.563L19.5 9M9 15l-4.5 4.5M14.5 4L20 9.5"/></svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h24v24H0z" stroke="none"/><path d="M15 4.5l-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4L20 9.5"/></svg>
  {/if}
</Button>

<Button on:click={() => event('close', item.id)} title="Close tab">
  <XIcon />
</Button>