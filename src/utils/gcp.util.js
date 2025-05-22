const { bucket } = require("../configs/gcp.config");

const uploadToGCS = async (fileBuffer, destinationPath, contentType) => {
  const file = bucket.file(destinationPath);
  const stream = file.createWriteStream({
    metadata: {
      contentType,
    },
    resumable: false,
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => reject(err));

    stream.on("finish", async () => {
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      resolve(publicUrl);
    });

    stream.end(fileBuffer);
  });
};

const deleteFromGCS = async (fileUrl) => {
  const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;
  const filePath = fileUrl.replace(baseUrl, "");
  const file = bucket.file(filePath);
  try {
    await file.delete();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  uploadToGCS,
  deleteFromGCS,
};
