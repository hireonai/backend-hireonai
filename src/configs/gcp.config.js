const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Ganti dengan file credentials dari GCP
const serviceKeyPath = path.join(__dirname, "../keys/gcs-service-account.json");

const storage = new Storage({
  keyFilename: serviceKeyPath,
  projectId: "cariin-capstone", // sesuaikan
});

const bucketName = "main-storage-hireon";
const bucket = storage.bucket(bucketName);

module.exports = { storage, bucket };
