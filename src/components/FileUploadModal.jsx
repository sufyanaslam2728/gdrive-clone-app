"use client";
import { useState } from "react";

export default function FileUploadModal({
  onClose,
  userId,
  folderId,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!file) return;

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      formData.append("folderId", folderId);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        await onSuccess();
        setLoading(false);
      } else {
        alert(data.error || "Failed to upload file.");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-black p-10 rounded shadow-lg w-md">
        <h2 className="text-xl mb-8">Upload File</h2>
        <form onSubmit={handleUpload}>
          <input
            required
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 rounded mb-8 w-full file:hover:cursor-pointer file:bg-gray-400 file:p-3 file:me-3"
          />
          <div className="flex justify-end gap-3 text-white font-semibold">
            <button
              onClick={onClose}
              className="hover:cursor-pointer px-3 py-2 bg-gray-700 rounded hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="hover:cursor-pointer px-4 py-2 bg-green-700 rounded hover:bg-green-800"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
