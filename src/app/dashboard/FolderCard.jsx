"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";

export default function FolderCard({
  folder,
  onClick,
  onDelete,
  view = "grid",
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    if (onClick) onClick(folder);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(folder.id);
      toast.success("Folder deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete folder"
      );
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  const GridView = () => (
    <div
      className="relative border p-4 rounded bg-white dark:bg-[#121212] shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold truncate text-[var(--foreground)]">
        {folder.name}
      </h3>

      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
      >
        ✖
      </button>

      {showConfirm && (
        <ConfirmationModal
          itemName={folder.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );

  const ListView = () => (
    <li
      className="flex items-center justify-between border p-3 rounded bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-[#1c1c1c] transition cursor-pointer"
      onClick={handleClick}
    >
      <span className="truncate text-[var(--foreground)]">{folder.name}</span>
      <button
        onClick={handleDeleteClick}
        className="text-sm text-red-500 hover:text-red-700"
      >
        Delete
      </button>
      {showConfirm && (
        <ConfirmationModal
          itemName={folder.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </li>
  );

  return view === "grid" ? <GridView /> : <ListView />;
}
