"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import DeleteIcon from "@/icons/DeleteIcon";
import FilePreviewIcon from "@/icons/FilePreviewIcon";
import FileIcon from "@/icons/FileIcon";

export default function FileCard({ file, onClick, onDelete, view = "grid" }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = () => {
    if (onClick) onClick(file);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(file.id);
      toast.success("File Deleted Successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        typeof err === "string" ? err : err?.message || "Failed to delete file"
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

  const fileExtension = file.name?.split(".").pop()?.toLowerCase();

  const isPreviewable = ["jpg", "jpeg", "png", "webp", "gif"].includes(
    fileExtension
  );

  const PreviewModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowPreview(false)}
    >
      <div
        className="bg-white dark:bg-[#1a1a1a] p-6 rounded shadow-lg max-w-3xl w-full h-[80%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Preview: {file.name}
          </h2>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setShowPreview(false)}
          >
            ✖
          </button>
        </div>
        <div className="w-full h-full">
          {isPreviewable ? (
            <iframe
              src={file.url.replace(/^http:\/\//, "https://")}
              title="File Preview"
              className="w-full h-full rounded border"
            />
          ) : (
            <div className="text-center text-gray-500 pt-10">
              This file type cannot be previewed.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ActionButtons = () => (
    <div className="mt-4 flex gap-2 justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPreview(true);
        }}
        className="flex gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-800"
      >
        <FilePreviewIcon />
        Preview
      </button>

      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
      >
        <DeleteIcon />
      </button>
    </div>
  );

  const GridView = () => (
    <div
      className="relative border p-5 rounded bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md hover:shadow-xl transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex gap-1">
        <FileIcon className="w-8 h-8" />
        <h3 className="text-lg font-semibold truncate text-[var(--foreground)]">
          {file.name}
        </h3>
      </div>
      <ActionButtons />

      {showConfirm && (
        <ConfirmationModal
          itemName={file.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}

      {showPreview && <PreviewModal />}
    </div>
  );

  const ListView = () => (
    <li
      className="w-1/2 flex items-center justify-between border p-4 rounded bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md hover:shadow-xl transition cursor-pointer"
      onClick={handleClick}
    >
      <span className="flex items-center gap-2 truncate text-[var(--foreground)]">
        <FileIcon className="w-7 h-7" />
        {file.name}
      </span>

      <div className="flex gap-2 mt-2 sm:mt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPreview(true);
          }}
          className="px-2 py-1 text-blue-500 hover:text-blue-700 text-sm hover:underline"
        >
          Preview
        </button>
        <button
          onClick={handleDeleteClick}
          className="px-2 py-1 text-red-500 hover:text-red-700 text-sm hover:underline"
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <ConfirmationModal
          itemName={file.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}

      {showPreview && <PreviewModal />}
    </li>
  );

  return view === "grid" ? <GridView /> : <ListView />;
}
