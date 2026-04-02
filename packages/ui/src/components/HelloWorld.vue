<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  msg?: string
}>()

const count = ref(0)
</script>

<template>
  <div class="hello-world">
    <h1>{{ msg || 'Hello World from UI Kit' }}</h1>
    <button class="counter" @click="count++">Count is {{ count }}</button>
  </div>
</template>

<style scoped>
.hello-world {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}
.counter {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
