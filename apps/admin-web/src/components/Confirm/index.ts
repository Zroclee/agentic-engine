import { createVNode, render } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';

export interface ConfirmOptions {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export const Confirm = (options: ConfirmOptions | string): Promise<boolean> => {
  return new Promise((resolve) => {
    const opts = typeof options === 'string' ? { content: options } : options;
    
    const container = document.createElement('div');
    document.body.appendChild(container);

    const removeDialog = () => {
      render(null, container);
      container.remove();
    };

    const handleConfirm = () => {
      resolve(true);
      removeDialog();
    };

    const handleCancel = () => {
      resolve(false);
      removeDialog();
    };

    const vnode = createVNode(ConfirmDialog, {
      ...opts,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    });

    render(vnode, container);
  });
};

export default Confirm;
