import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/files directory exists
const uploadDir = "uploads/files";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "template-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".zip", ".rar", ".7z"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only archive files (ZIP, RAR, 7Z) are allowed"), false);
  }
};

export const zipUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for ZIPs
  fileFilter,
});
