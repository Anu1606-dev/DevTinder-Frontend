import { forwardRef, useImperativeHandle, useRef } from "react";

const ConfirmModal = forwardRef(
  ({ title, message, confirmText = "Confirm", confirmVariant = "btn-primary", onConfirm }, ref) => {
    const dialogRef = useRef(null);

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    const handleConfirm = () => {
      dialogRef.current?.close();
      onConfirm?.();
    };

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-base-content">{title}</h3>
          <p className="py-4 text-base-content/70">{message}</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">Cancel</button>
              <button type="button" onClick={handleConfirm} className={`btn ${confirmVariant}`}>
                {confirmText}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

ConfirmModal.displayName = "ConfirmModal";

export default ConfirmModal;