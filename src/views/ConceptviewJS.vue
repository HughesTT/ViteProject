<template>
  <h2 class="mb-4">JavaScript</h2>
  <div class="container">
    <div class="row concept-content" v-for="item in jsData.question" :key="item.question">
      <div class="col-1">
        <div class="concept-icon justify-content-center d-flex">
          <i class="bi bi-arrow-up-right-circle-fill"></i>
        </div>
      </div>
      <div class="col-11">
        <div class="concept-question">
          <h2>{{ item.question }}</h2>
        </div>
        <div class="concept-answer">
          <p>{{ item.answer }}</p>
          <p class="concept-tips">{{ item.tips }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import jsData from './Question/js.json'


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
</style>