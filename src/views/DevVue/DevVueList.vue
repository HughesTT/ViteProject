<template>
  <div class="container">
    <div class="row">
      <div class="devcard col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">To-Do-List</h5>
            <p class="card-text">資料儲存於瀏覽器</p>
            <router-link to="/devconcept/vue/todolist" class="linkto">🎯</router-link>
          </div>
        </div>
      </div>
      <div class="devcard col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Axios 引用外部資料</h5>
            <p class="card-text">引用json資料</p>
            <router-link to="/devconcept/vue/axiosjson" class="linkto">🚀</router-link>
          </div>
        </div>
      </div>
      <div class="devcard col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Axios結合Props、Emit</h5>
            <p class="card-text">資料分頁顯示</p>
            <router-link to="/devconcept/vue/axiospropsemit" class="linkto">🚀</router-link>
          </div>
        </div>
      </div>
      <div class="devcard col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">訂餐系統</h5>
            <p class="card-text">飲料訂餐系統</p>
            <router-link to="/devconcept/vue/reservationPage" class="linkto">🚀</router-link>
          </div>
        </div>
      </div>
      <div class="devcard col-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">觀光旅遊</h5>
            <p class="card-text">資料搜尋</p>
            <router-link to="/devconcept/vue/leisurefarm" class="linkto">🚀</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");

.container {
  padding-bottom: 3em;
}

.concept-content {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;

  .concept-icon {
    font-size: 2rem;
    color: #799f44;
    margin-top: 10px;
  }

  .concept-question {
    h2 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
  }

  .concept-answer {
    p {
      font-size: 1rem;
      color: #555;
      line-height: 1.5;
    }

    .concept-tips {
      color: #337ab7;
      margin-top: 10px;
      font-style: italic;
      font-weight: bold;
    }
  }
}

.devcard {
  margin-top: 20px;
  margin-bottom: 5px;

  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .card-body {
      padding: 15px;

      .card-title {
        font-size: 1.25rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }

      .card-text {
        font-size: 1rem;
        color: #555;
        line-height: 1.5;
        margin-bottom: 15px;
      }

      .linkto {
        font-size: 1.5rem;
        text-decoration: none;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>