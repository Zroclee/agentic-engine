import { ref } from 'vue';

export type MessageType = 'info' | 'success' | 'warning' | 'error';

export interface MessageOptions {
  id: string;
  type: MessageType;
  content: string;
  duration?: number;
}

export const messages = ref<MessageOptions[]>([]);

export const addMessage = (options: Omit<MessageOptions, 'id'>) => {
  const id = Math.random().toString(36).slice(2);
  messages.value.push({ ...options, id });
  
  const duration = options.duration || 3000;
  if (duration > 0) {
    setTimeout(() => {
      removeMessage(id);
    }, duration);
  }
};

export const removeMessage = (id: string) => {
  messages.value = messages.value.filter(m => m.id !== id);
};
