const axios = require("axios");
const downloadImageUrl = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const contentType = response.headers["content-type"];
  const buffer = Buffer.from(response.data, "binary");

  return { buffer, contentType };
};

module.exports = downloadImageUrl;
