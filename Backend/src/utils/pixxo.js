import Pixxo from "@sarangkale66/pixxo-sdk-node";
import config from "../config/env.js";
import { promises as fs } from "fs";
import path from "path";

const pixxoClient = new Pixxo({
  email: config.pixxoEmail,
  password: config.pixxoPassword,
});

async function uploadFile(filename) {
  try {
    const filePath = path.join(process.cwd(), "temp", filename);
    const fileBuffer = await fs.readFile(filePath);

    const result = await pixxoClient.upload({
      file: fileBuffer,
      fileName: filename,
      folder: "/yt-uploads/images",
    });

    console.log("✅ Upload complete!");
    console.log(`URL: ${result.url}`);

    void fs.unlink(filePath).catch((err) => {
      console.error("⚠️ Failed to delete temp file:", err.message);
    });

    return result;
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    throw error;
  }
}

export { uploadFile };