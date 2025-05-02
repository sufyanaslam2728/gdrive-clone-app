"use client";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import FolderCreationModal from "./FolderCreationModal";
import FolderEditModal from "./FolderEditModal";
import FolderCard from "./FolderCard";
import FileUploadModal from "./FileUploadModal";
import FileCard from "./FileCard";

export default function FolderListing({ userId }) {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      const res = await fetch(
        `/api/folders?userId=${userId}&parentId=${currentFolder?.id || null}`
      );
      const data = await res.json();
      setFolders(data);
    };

    fetchFolders();
  }, [userId, currentFolder]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch(
        `/api/files?userId=${userId}&folderId=${currentFolder?.id || null}`
      );
      const data = await res.json();
      setFiles(data);
    };

    fetchFiles();
  }, [userId, currentFolder]);

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setFolderPath((prev) => [...prev, folder]);
  };

  const handleBack = () => {
    const newPath = [...folderPath];
    newPath.pop();
    setFolderPath(newPath);
    setCurrentFolder(newPath[newPath.length - 1] || null);
  };

  const handleCreateFolder = async (folderName) => {
    const res = await fetch("/api/folders", {
      method: "POST",
      body: JSON.stringify({
        name: folderName,
        userId,
        parentId: currentFolder?.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setShowModal(false);

      const refreshed = await fetch(
        `/api/folders?userId=${userId}&parentId=${currentFolder?.id || null}`
      );
      setFolders(await refreshed.json());
    } else {
      console.error("Failed to create folder");
    }
  };

  const handleEditFolder = async (newName) => {
    const res = await fetch(`/api/folders/${currentFolder.id}`, {
      method: "PUT",
      body: JSON.stringify({ name: newName }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setShowEditModal(false);
      setCurrentFolder({ ...currentFolder, name: newName });
      setFolderPath((path) =>
        path.map((f) =>
          f.id === currentFolder.id ? { ...f, name: newName } : f
        )
      );
    } else {
      console.error("Failed to update folder name");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const res = await fetch(`/api/folders/${folderId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFolders(folders.filter((folder) => folder.id !== folderId));
    } else {
      console.error("Failed to delete folder");
    }
  };

  const handleFileUploadSuccess = (file) => {
    console.log("File uploaded:", file);
    toast.success("File uploaded successfully.");
    setShowFileUploadModal(false);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("File Deleted Successfully.");
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      } else {
        console.error("Failed to delete file");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Folders</h2>
        <div>
          <button
            onClick={() =>
              setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
            }
            className="mr-2 px-3 py-1 bg-gray-200 rounded"
          >
            Toggle View
          </button>
          {currentFolder && (
            <button
              onClick={() => setShowEditModal(true)}
              className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit Folder Name
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Folder
          </button>
          <button
            onClick={() => setShowFileUploadModal(true)}
            className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Upload File
          </button>
        </div>
      </div>

      {folderPath.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-gray-600">
          <button
            onClick={handleBack}
            className="text-sm text-blue-500 hover:underline"
          >
            ⬅ Back
          </button>
          <span>/</span>
          {folderPath.map((folder, idx) => (
            <span key={folder.id}>
              {folder.name}
              {idx < folderPath.length - 1 && <span> / </span>}
            </span>
          ))}
        </div>
      )}

      {showModal && (
        <FolderCreationModal
          onCreate={handleCreateFolder}
          onClose={() => setShowModal(false)}
        />
      )}

      {showEditModal && (
        <FolderEditModal
          currentName={currentFolder?.name}
          onEdit={handleEditFolder}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showFileUploadModal && (
        <FileUploadModal
          onClose={() => setShowFileUploadModal(false)}
          userId={userId}
          folderId={currentFolder?.id}
          onSuccess={handleFileUploadSuccess}
        />
      )}

      {folders.length === 0 ? (
        <p className="text-gray-500">No folders available.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              view={viewMode}
              onClick={handleFolderClick}
              onDelete={handleDeleteFolder}
            />
          ))}
        </div>
      )}

      {files.length === 0 ? (
        <p className="text-gray-500">No files in this folder.</p>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={() => handleDeleteFile(file.id)}
              view={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
