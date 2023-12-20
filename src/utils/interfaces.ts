export interface ModalProps<T> {
  onClose: () => void;
  onSubmit: (data: T) => void;
}
