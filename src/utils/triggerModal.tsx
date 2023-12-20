import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalProps } from './interfaces';

type GetSubmitDataType<T> = T extends ModalProps<infer R> ? R : never;

function triggerModal<R extends ModalProps<T>, T = GetSubmitDataType<R>>(
  Modal: React.FC<R>,
  _props?: Omit<R, 'onSubmit' | 'onClose'>,
): Promise<T | undefined> {
  return new Promise(resolve => {
    const root = ReactDOM.createRoot(document.getElementById('modal-root') as HTMLDivElement);
    const removeModal = () => {
      root.unmount();
    };

    const props = {
      ..._props,
      onSubmit: (data: T) => {
        removeModal();
        resolve(data);
      },
      onClose: () => {
        removeModal();
        resolve(undefined);
      },
    } as R;

    root.render(
      <div className="modal-mask">
        <Modal {...props} />
      </div>,
    );
  });
}

export default triggerModal;
