const { Storage } = require("@google-cloud/storage");
const path = require("path");
const env = require("../configs/env.config");

// Handle both absolute and relative paths for GCP service account key
const serviceKeyPath = path.isAbsolute(env.gcpPathSecret) 
  ? env.gcpPathSecret 
  : path.join(__dirname, env.gcpPathSecret);

const storage = new Storage({
  keyFilename: serviceKeyPath,
  projectId: env.gcpProjectId,
});

const bucketName = env.gcpBucketName;
const bucket = storage.bucket(bucketName);

module.exports = { storage, bucket };
