export interface ModalProps<T> {
  title?: string;
  className?: string;
  onClose: () => void;
  onSubmit: (data: T) => void;
}

export interface EditableModalProps<T> extends ModalProps<T> {
  data?: T;
}
