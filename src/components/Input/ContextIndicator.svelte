<script>
  import { SearchIcon } from 'svelte-feather-icons';
  import { inputState, searchVal } from '../../store';
</script>

{#if $inputState === 'pluginText' && $searchVal.plugin.displayName}
  <div class="plugin">
    {$searchVal.plugin.displayName}
  </div>
{:else}
  <span style="margin-right: 8px">
    <SearchIcon class="icon" size="22" />
  </span>
{/if}

<style>
  .plugin {
    white-space: nowrap;
    background-color: rgba(149, 149, 149, 0.2);
    border-radius: 4px;
    padding: 8px;
    font-weight: 600;
    margin-right: 8px;
    font-size: 14px;
  }
</style>