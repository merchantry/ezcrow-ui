import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalProps } from './interfaces';
import { GetModalSubmitDataType } from './types';

function triggerModal<R extends ModalProps<T>, T = GetModalSubmitDataType<R>>(
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
