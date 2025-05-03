# 🗂️ Simplified Google Drive Clone

A full-stack Google Drive Clone built with modern web technologies. This application allows users to upload files, manage folders, and browse their personal file system in a secure and responsive interface. It includes user authentication, file previews, and Cloudinary-based file storage.

## 🚀 Tech Stack

### Frontend

- **Next.js (App Router)** – For a performant, server-side rendered React experience.
- **Tailwind CSS** – For rapid, utility-first styling.
- **React** – Component-based UI development.

### Backend

- **Next.js API Routes** – Lightweight, integrated backend using Node.js.
- **PostgreSQL** – Relational database for storing file metadata and user data.
- **TypeORM (EntitySchema)** – ORM used with PostgreSQL for structured data operations.
- **Cloudinary** – Cloud storage for uploaded files with CDN support.
- **NextAuth.js** – Secure and extensible authentication for user management.

## ✨ Core Features

### 🔐 User Authentication

- Sign up, Log in, Log out
- Protected routes using `NextAuth.js`
- Only authenticated users can access their storage

### 📁 File & Folder System

- Create folders
- Upload files to specific folders
- View structure in a list or optional tree view
- Breadcrumb navigation for folder paths

### 📝 File Management

- Rename and delete files/folders
- Preview support:
  - **Images (PNG, JPG, etc.)**
  - **PDF Info Preview (limited)**

> ⚠️ **Note on PDF Previews**:  
> Due to Cloudinary restrictions, direct embedded PDF previews are not supported via their preview URLs and neither they allow to download.

### 👤 User-Specific Storage

- Each user sees only their own files and folders
- Isolated database entries per user
- Ownership checks before file or folder actions

### 📱 Responsive Design

- Tailored UI for both desktop and mobile
- Clean and intuitive folder navigation interface

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/sufyanaslam2728/google-drive-clone.git
cd google-drive-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and include:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the App

```bash
npm run dev
```

## 📦 Future Improvements

- Implement drag-and-drop file uploads
- Add shareable links or folder collaboration
- Enhanced PDF previews using PDF.js or embedded viewers
- Folder tree-view with collapse/expand logic

## 🙋‍♂️ Why These Choices?

- **Next.js App Router** – For file-based routing and server components
- **Cloudinary** – Fast and scalable file hosting with CDN
- **PostgreSQL + TypeORM** – Robust relational DB with type-safe ORM
- **NextAuth.js** – Secure and easy to integrate with PostgreSQL adapter
- **Tailwind CSS** – Fast, scalable styling and responsive design

## 📌 Known Issues

- **Cloudinary PDF Limitations**: Direct embedded previews for PDFs aren't natively supported.
- **No recursive folder deletion**: Deletion is blocked if a folder contains files or subfolders to prevent data loss.

## 📸 Screenshot

> While attempting to share a PDF file uploaded to Cloudinary, I received a restriction notice indicating that PDF files cannot be shared externally. This confirms that Cloudinary does not support direct external sharing or embedding for PDF files, which limits the ability to preview or generate PDF viewers directly from Cloudinary-hosted files.

![Cloudinary Issue Screenshot](screenshot/cloudinary_issue.png)

## 📝 License

MIT License. See `LICENSE` file for more details.
