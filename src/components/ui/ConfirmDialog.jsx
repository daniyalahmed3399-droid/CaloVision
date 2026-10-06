"use client";

import Button from "./Button";
import Modal from "./Modal";

// Asks before anything destructive (the guide: never delete on one click).
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel} title={title}>
      <p className="text-sm leading-6 text-gray-600">{message}</p>

      <div className="mt-6 flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
          disabled={loading}
          data-autofocus
        >
          Cancel
        </Button>

        <Button
          className="flex-1 !bg-red-600 hover:!bg-red-700"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
