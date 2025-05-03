"use client";

import { useState } from "react";

export default function FolderCreationModal({ onCreate, onClose }) {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(folderName);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-black p-10 rounded shadow-lg w-md">
        <h3 className="text-xl mb-8">Create a New Folder</h3>
        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder Name"
            className="p-3 border border-gray-300 rounded mb-8 w-full"
          />
          <div className="flex justify-end gap-3 text-white font-semibold">
            <button
              type="button"
              onClick={onClose}
              className="hover:cursor-pointer px-4 py-2 bg-gray-600 rounded hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hover:cursor-pointer px-4 py-2 bg-blue-600 rounded hover:bg-blue-800"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
