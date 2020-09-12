<script>
  import { results } from '../store';
</script>

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

<style>
  .results {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow-y: auto;
    max-height: 60vh;
  }

  .results li {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .results li:hover {
    background-color: rgba(0, 191, 255, 0.3);
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