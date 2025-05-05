// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config(); // ✅ Load environment variables from .env

// const { Pool } = pg;

// const pool = new Pool({
//   user: process.env.DB_USER,       // e.g., 'harshtrivedi'
//   host: process.env.DB_HOST,       // e.g., 'localhost'
//   database: process.env.DB_NAME,   // e.g., 'harsh_dms_db'
//   password: process.env.DB_PASSWORD, // use DB_PASSWORD (not DB_PASS for consistency)
//   port: process.env.DB_PORT || 5432,
// });

// // ✅ Save file metadata to PostgreSQL
// export const saveFileMetadata = async ({ userId, fileName, fileSize, s3Key }) => {
//     const query = `
//       INSERT INTO file_metadata (user_id, file_name, file_size, s3_key, upload_timestamp)
//       VALUES ($1, $2, $3, $4, NOW())
//       RETURNING *;
//     `;
//     const values = [userId, fileName, fileSize, s3Key];
  
//     try {
//       const result = await pool.query(query, values);
//       console.log(result);
//       return result.rows[0]; // Return the newly inserted row
//     } catch (error) {
//       console.error("Error saving file metadata:", error);
//       throw new Error("Failed to save file metadata.");
//     }
// };
  
// // ✅ Optional: expose pool if needed elsewhere
// export { pool };



import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// console.log("Database connection established", pool);
// Function to fetch all file metadata
const fetchAllFiles = async () => {
  try {
    const result = await pool.query('SELECT * FROM file_metadata ORDER BY upload_timestamp DESC;');
    console.log('All File Metadata:');
    console.table(result.rows); // Nicely formats as a table in console
  } catch (error) {
    console.error('Error fetching file metadata:', error);
  } finally {
    // await pool.end(); // Optional: close connection when done
  }
};

// Call the function
fetchAllFiles();

// const pool = new Pool({
//     connectionString: 'postgresql://neondb_owner:npg_A5TzRa6yKEDX@ep-small-sea-a4o8gekl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });

// Save file metadata to PostgreSQL
export const saveFileMetadata = async ({ file_name, file_size, upload_timestamp, s3_url }) => {
  console.log("Saving file metadata to database");
  console.log("File name:", file_name);
  console.log("File size:", file_size);
  console.log("S3 URL:", s3_url);
  console.log("Upload timestamp:", upload_timestamp);
  // Check if the required fields are provided
  if (!file_name || !file_size || !s3_url || !upload_timestamp) {
    throw new Error("Missing required fields: file_name, file_size, s3_url, upload_timestamp");
  }
  // Check if the file size is a valid number
  if (isNaN(file_size) || file_size <= 0) {
    throw new Error("Invalid file size. It must be a positive number.");
  }
  // Check if the upload timestamp is a valid date
  const uploadDate = new Date(upload_timestamp);
  if (isNaN(uploadDate.getTime())) {
    throw new Error("Invalid upload timestamp. It must be a valid date.");
  }
  const query = `
    INSERT INTO file_metadata (file_name, file_size, s3_url, upload_timestamp)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  // Use parameterized queries to prevent SQL injection
  
  const values = [file_name, file_size, s3_url, upload_timestamp];

  try {
    console.log("Insert into database");
    const result = await pool.query(query, values);
    console.log("Result Success");
    return result.rows[0];
  } catch (error) {
    console.error("Error saving file metadata:", error);
    throw new Error("Failed to save file metadata.");
  }
};

// Delete file metadata from PostgreSQL
export const deleteFileMetadata = async (s3_url) => {
  const query = `
    DELETE FROM file_metadata
    WHERE s3_url = $1
    RETURNING *;
  `;
  const values = [s3_url];

  try {
    const result = await pool.query(query, values);
    console.log(result)
    if (result.rowCount === 0) {
      console.warn(`No metadata found for s3_key: ${s3_url}`);
    }
    return result.rows[0] || null; // Return the deleted row or null if none found
  } catch (error) {
    console.error("Error deleting file metadata:", error);
    throw new Error("Failed to delete file metadata.");
  }
};

// Expose pool if needed elsewhere
export { pool };