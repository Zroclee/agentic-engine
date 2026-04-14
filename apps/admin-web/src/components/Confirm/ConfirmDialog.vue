<template>
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg" v-if="title">{{ title }}</h3>
      <h3 class="font-bold text-lg" v-else>提示</h3>
      <p class="py-4">{{ content }}</p>
      <div class="modal-action">
        <button class="btn" @click="$emit('cancel')">{{ cancelText }}</button>
        <button class="btn" :class="confirmBtnClass" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('cancel')">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}>(), {
  title: '提示',
  confirmText: '确定',
  cancelText: '取消',
  type: 'warning'
});

defineEmits(['confirm', 'cancel']);

const confirmBtnClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'btn-error';
    case 'warning':
      return 'btn-warning';
    case 'success':
      return 'btn-success';
    case 'info':
    default:
      return 'btn-primary';
  }
});
</script>
