<script>
  export let style;
</script>

<div class="pill" style={style}>
  <slot />
</div>

<style>
  .pill {
    white-space: nowrap;
    background-color: var(--bg-pill);
    border-radius: 4px;
    padding: 8px;
    font-weight: 600;
    font-size: 14px;
  }
</style>