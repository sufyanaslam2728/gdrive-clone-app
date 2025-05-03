"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import DeleteIcon from "@/icons/DeleteIcon";
import FolderIcon from "@/icons/FolderIcon";

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
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete the folder!"
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
      className="relative border p-5 rounded bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md hover:shadow-xl transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        <FolderIcon />
        <h3 className="text-lg font-semibold truncate text-[var(--foreground)]">
          {folder.name}
        </h3>
      </div>

      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
      >
        <DeleteIcon />
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
      className="w-1/2 flex items-center justify-between border p-4 rounded bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md hover:shadow-xl transition cursor-pointer"
      onClick={handleClick}
    >
      <span className="flex gap-2 items-center truncate text-[var(--foreground)]">
        <FolderIcon />
        {folder.name}
      </span>
      <button
        onClick={handleDeleteClick}
        className="text-sm text-red-500 hover:text-red-700 hover:underline"
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
