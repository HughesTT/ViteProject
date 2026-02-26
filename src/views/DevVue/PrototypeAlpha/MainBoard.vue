<template>
  <div class="col-md-10">
    <div class="text-center default-tips" v-if="currentComponent === undefined">點選左側選項</div>
    <div class="board-content" v-else>
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ContentA from '../PrototypeAlpha/ContentA.vue'
import ContentB from '../PrototypeAlpha/ContentB.vue'
import ContentC from '../PrototypeAlpha/ContentC.vue'
import ContentD from '../PrototypeAlpha/ContentD.vue'

const props = defineProps({
  selected: {
    type: String,
    required: false
  }
})

const componentMap = {
  A: ContentA,
  B: ContentB,
  C: ContentC,
  D: ContentD
}

const currentComponent = computed(() => componentMap[props.selected])
</script>

<style lang="scss">
.default-tips {
  margin-top: 170px;
  color: #999;
  font-size: 1.3em;
}

.board-content {
  margin: 0 1em;
  padding: 1em;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>