"use client";
import { useState } from "react";

export default function FolderEditModal({ currentName, onEdit, onClose }) {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onEdit(newName);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-black p-10 rounded shadow-lg w-md">
        <h2 className="text-xl mb-8">Edit Folder Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-3 border border-gray-300 rounded mb-8 w-full"
          />
          <div className="flex justify-end gap-3 text-white font-semibold">
            <button
              type="button"
              onClick={onClose}
              className="hover:cursor-pointer px-3 py-2 bg-gray-700 rounded hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hover:cursor-pointer px-5 py-2 bg-green-700 rounded hover:bg-green-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
