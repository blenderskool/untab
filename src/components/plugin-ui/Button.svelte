<script>
  export let title;
</script>

<button class="plugin-btn" title={title} on:click>
  <slot />
</button>

<style>
  .plugin-btn {
    background-color: var(--bg-pill);
    color: var(--gray-800);
    padding: 0.2rem 0.4rem;
    min-width: 25px;
    min-height: 25px;
    display: inline-flex;
    border-radius: 4px;
    border: 1px solid var(--gray-500);
    margin-left: 6px;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.025rem;
    transform: transition 0.2s ease;
  }
  .plugin-btn:first-of-type {
    margin-left: 0;
  }
  .plugin-btn:hover {
    transform: scale(1.05);
  }

  :global(.plugin-btn svg) {
    width: 17px !important;
  }
</style>