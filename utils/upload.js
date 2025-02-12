const fs = require("fs");
const { writeFile } = require("fs").promises;
const multer = require("multer");
const path = require("path");
const uuid = require("uuid");

//UPLOAD FOLDER PATH
const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_FOLDER || "uploads");

const UPLOAD_SIZE_LIMIT = parseInt(process.env.UPLOAD_SIZE_LIMIT) || 10;

/**
 * generate filename using uuid
 * @param {object} file
 * @returns
 */

const getFileName = (file) => {
  const ext = path.extname(file.originalname);
  return `${uuid.v4()}${ext}`;
};

/**
 * Upload files to storage
 * @param {array} files
 * @param {string} appFolder
 * @returns
 */

const uploadFiles = async (files = [], appFolder) => {
  const uploadedFiles = [];

  for (const file of files) {
    const filename = getFileName(file);
    const folderPath = appFolder ? path.join(UPLOAD_DIR, appFolder) : UPLOAD_DIR;
    const filePath = path.join(folderPath, filename);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    await writeFile(filePath, file.buffer, "binary");

    uploadedFiles.push({
      originalname: file.originalname,
      path: filePath,
      filename,
    });
  }

  return uploadedFiles;
};

// multer config

const storage = multer.memoryStorage({});

const uploader = multer({
  storage: storage,
  limits: {
    fileSize: 1024 ** 2 * UPLOAD_SIZE_LIMIT,
  },
});

/**
 * get file path
 * @param {string} appFolder
 * @param {string} filename
 * @returns
 */

const getFilePath = (appFolder, filename) => {
  return appFolder ? path.join(UPLOAD_DIR, appFolder, filename) : path.join(UPLOAD_DIR, filename);
};

const isFileExists = (appFolder, filename) => {
  const p = appFolder ? path.join(UPLOAD_DIR, appFolder) : UPLOAD_DIR;

  return fs.existsSync(path.join(p, filename));
};

const deleteFile = (appFolder, filename) => {
  appFolder
    ? fs.unlinkSync(path.join(getFilePath(appFolder, filename)))
    : fs.unlinkSync(path.join(getFilePath(null, filename)));
};

const deleteFileIfExists = (appFolder, filename) => {
  if (isFileExists(appFolder, filename)) deleteFile(appFolder, filename);
};

const createFileStream = (filePath) => {
  return fs.createReadStream(filePath);
};

module.exports = {
  UPLOAD_SIZE_LIMIT,
  UPLOAD_DIR,
  uploader,
  getFilePath,
  isFileExists,
  deleteFile,
  deleteFileIfExists,
  createFileStream,
  uploadFiles,
};
