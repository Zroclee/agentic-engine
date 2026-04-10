import { createVNode, render } from 'vue';
import MessageManager from './MessageManager.vue';
import { addMessage, type MessageType } from './state';

let isMounted = false;

const init = () => {
  if (isMounted) return;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const vnode = createVNode(MessageManager);
  render(vnode, container);
  isMounted = true;
};

const showMessage = (type: MessageType, content: string, duration = 3000) => {
  init();
  addMessage({ type, content, duration });
};

export const Message = {
  info: (content: string, duration?: number) => showMessage('info', content, duration),
  success: (content: string, duration?: number) => showMessage('success', content, duration),
  warning: (content: string, duration?: number) => showMessage('warning', content, duration),
  error: (content: string, duration?: number) => showMessage('error', content, duration),
};

export default Message;
