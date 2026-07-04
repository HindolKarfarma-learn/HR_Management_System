import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end gap-3 p-6">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>Confirm</Button>
      </div>
    </Modal>
  );
}
