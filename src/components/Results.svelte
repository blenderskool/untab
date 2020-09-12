<script>
  import { results } from '../store';
</script>

{#if $results.length}
  <ul class="results">
    {#each $results as { item }}
      <li>
        <img class="favicon" src={item.favicon} alt="">
        <div class="info">
          <h4 class="title">{item.title}</h4>
          <p class="url">{item.url}</p>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .results {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow-y: auto;
    max-height: 60vh;
    border-top: 1px solid #CECECE;
  }

  .results li {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .results li:hover {
    background-color: rgba(99, 179, 237, 0.45);
  }

  .favicon {
    width: 16px;
    margin-right: 0.7rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title, .url {
    margin: 0;
  }
</style>