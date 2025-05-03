"use client";

export default function ConfirmationModal({
  itemName,
  onConfirm,
  onCancel,
  isDeleting,
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-[#1a1a1a] p-6 rounded shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[var(--foreground)] mb-4">
          Are you sure you want to delete <strong> "{itemName}"</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
