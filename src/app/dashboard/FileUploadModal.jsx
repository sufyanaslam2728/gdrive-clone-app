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

  const handleUpload = async () => {
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
    setLoading(false);

    if (res.ok) {
      onSuccess(data);
      onClose();
    } else {
      alert(data.error || "Failed to upload file.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-lg mb-4">Upload File</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
