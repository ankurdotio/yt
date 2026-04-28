import path from "path";
import fs from "fs";
import { uploadFile } from "../utils/pixxo.js";

// Image upload handler
export const uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// Save file to temp folder
		const tempDir = path.join(process.cwd(), "temp");
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir);
		}
		const tempPath = path.join(tempDir, req.file.originalname);
		await fs.promises.writeFile(tempPath, req.file.buffer);

		// Upload to Pixxo
		const result = await uploadFile(req.file.originalname);

		return res.json({
      success: true,
      url: result.url,
      message: "Image uploaded successfully" 
    });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
