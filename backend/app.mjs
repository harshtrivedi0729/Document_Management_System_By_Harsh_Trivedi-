import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import { uploadToS3 } from "./s3.mjs";
import { getUserPresignedUrls } from "./s3.mjs";
import { deleteFromS3 } from "./s3.mjs";
import { saveFileMetadata, deleteFileMetadata } from "./db.mjs";

const app = express();

const PORT = process.env.PORT || 4000;

const storage = memoryStorage();
const upload = multer({ storage });

app.use(
  cors({
    origin: "*",
  })
);
app.use(json());

app.post("/images", upload.single("image"), async (req, res) => {
  const { file } = req;
  const userId = req.headers["x-user-id"];
  console.log("File:", file);

  if (!file || !userId) return res.status(400).json({ message: "Bad request." });

  try {
    const { error, key } = await uploadToS3({ file, userId });
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json({ key });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get("/images", async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ message: "Bad request." });

  try {
    const { error, presignedUrls } = await getUserPresignedUrls(userId);
    if (error) return res.status(500).json({ message: error.message });

    return res.status(200).json({ urls: presignedUrls });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.delete("/images/:key", async (req, res) => {
  const key = decodeURIComponent(req.params.key);
  const userId = req.headers["x-user-id"];

  if (!key || !userId) {
    return res.status(400).json({ message: "Missing key or user ID." });
  }

  try {
    // Delete from S3
    const { error } = await deleteFromS3(key);
    if (error) return res.status(500).json({ message: error.message });

    // Delete metadata from PostgreSQL
    await deleteFileMetadata(key);

    return res.status(200).json({ message: "Deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});