const fs = require("fs");
const {
  UPLOAD_DIR,
  uploadFiles,
  createFileStream,
  deleteFileIfExists,
} = require("../../../utils/upload");
const path = require("path");
module.exports = function attachments(schema, options = {}) {
  fs.mkdirSync(path.join(UPLOAD_DIR, options.dir), { recursive: true });
  schema.add({
    attachements: {
      type: [
        {
          filename: { type: String, required: true },
          originalname: { type: String, required: true },
          path: { type: String, required: true },
        },
      ],
    },
  });
  schema.method("uploadAttachments", async function (files) {
    const uploadedFiles = await uploadFiles(files, path.join(options.dir, this._id.toString()));

    this.attachements = this.attachements.concat(uploadedFiles);
    await this.save({ suppressWarning: true });
  });

  schema.method("deleteAttachment", async function (filename) {
    const filePath = path.join(options.dir, this._id.toString(), filename);

    await deleteFileIfExists(null, filePath);

    this.attachements.pull({ filename });

    await this.save({ suppressWarning: true });
  });

  schema.method("attachmentExists", function (filename) {
    const filePath = path.join(UPLOAD_DIR, options.dir, this._id.toString(), filename);
    return fs.existsSync(filePath);
  });

  schema.method("getAttachmentStream", function (filename) {
    const filePath = path.join(UPLOAD_DIR, options.dir, this._id.toString(), filename);
    return createFileStream(filePath);
  });

  schema.pre("deleteOne", { document: true }, function (next) {
    fs.rm(
      path.join(UPLOAD_DIR, options.dir, this._id.toString()),
      { recursive: true, force: true },
      () => {
        next();
      },
    );
  });
};
