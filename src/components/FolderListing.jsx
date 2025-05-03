"use client";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import FolderCreationModal from "./FolderCreationModal";
import FolderEditModal from "./FolderEditModal";
import FolderCard from "./FolderCard";
import FileUploadModal from "./FileUploadModal";
import FileCard from "./FileCard";
import GridViewIcon from "@/icons/GridViewIcon";
import ListViewIcon from "@/icons/ListViewIcon";
import AddFolderIcon from "@/icons/AddFolderIcon";
import AddFileIcon from "@/icons/AddFileIcon";
import EditIcon from "@/icons/EditIcon";

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
    fetchFolders();
    fetchFiles();
  }, [userId, currentFolder]);

  const fetchFolders = async () => {
    const res = await fetch(
      `/api/folders?userId=${userId}&parentId=${currentFolder?.id || null}`
    );
    const data = await res.json();
    setFolders(data);
  };

  const fetchFiles = async () => {
    const res = await fetch(
      `/api/files?userId=${userId}&folderId=${currentFolder?.id || null}`
    );
    const data = await res.json();
    setFiles(data);
  };

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
      toast.success("New Folder created successfully.");
      await fetchFolders();
    } else {
      toast.error("Failed to create new folder!");
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
      toast.success("Folder name updated successfully.");
      setCurrentFolder({ ...currentFolder, name: newName });
      setFolderPath((path) =>
        path.map((f) =>
          f.id === currentFolder.id ? { ...f, name: newName } : f
        )
      );
    } else {
      toast.error("Failed to update the folder name!");
      console.error("Failed to update the folder name");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        await fetchFolders();
        toast.success("Folder deleted successfully.");
      } else {
        console.error("Failed to delete folder");
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
      toast.error(err);
    }
  };

  const handleFileUploadSuccess = async () => {
    setShowFileUploadModal(false);
    toast.success("File uploaded successfully.");
    await fetchFiles();
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchFiles();
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">Your Folders & Files</h2>
        <div className="flex font-medium text-lg gap-2 text-white">
          <button
            onClick={() =>
              setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
            }
            className="px-3 py-1 bg-gray-200 rounded text-black hover:cursor-pointer hover:bg-gray-400"
          >
            {viewMode === "grid" ? (
              <div className="flex gap-1 items-center">
                <ListViewIcon /> List View
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <GridViewIcon /> Grid View
              </div>
            )}
          </button>
          {currentFolder && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex gap-1 items-center hover:cursor-pointer px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
            >
              <EditIcon />
              Edit Folder Name
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex gap-1 items-center hover:cursor-pointer px-3 py-1 bg-blue-500 rounded hover:bg-blue-700"
          >
            <AddFolderIcon /> Create Folder
          </button>
          <button
            onClick={() => setShowFileUploadModal(true)}
            className="flex gap-1 items-center hover:cursor-pointer px-3 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            <AddFileIcon /> Upload File
          </button>
        </div>
      </div>

      {folderPath.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-gray-400">
          <button
            onClick={handleBack}
            className="text-sm text-blue-500 hover:underline hover:cursor-pointer hover:text-blue-700"
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

      {folders.length === 0 && files.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          No folders/files available.
        </p>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-4 gap-4"
              : "flex flex-col gap-4 items-center"
          }
        >
          {folders?.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              view={viewMode}
              onClick={handleFolderClick}
              onDelete={handleDeleteFolder}
            />
          ))}
          {files?.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={() => handleDeleteFile(file.id)}
              view={viewMode}
            />
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
    </div>
  );
}
