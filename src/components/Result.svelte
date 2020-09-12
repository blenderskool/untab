<script>
  export let result;
  let faviconError = false;
</script>

<li>
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
  }
  li:hover {
    background-color: rgba(99, 179, 237, 0.45);
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