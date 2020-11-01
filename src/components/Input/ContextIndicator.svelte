<script>
  import { SearchIcon } from 'svelte-feather-icons';
  import { inputState, searchVal } from '../../store';
  import Pill from './Pill.svelte';
</script>

{#if $inputState === 'pluginText' && $searchVal.plugin.displayName}
  <Pill style="margin-right: 8px;">
    {$searchVal.plugin.displayName}
  </Pill>
{:else}
  <span style="margin-right: 8px">
    <SearchIcon class="icon" size="22" />
  </span>
{/if}
