import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { saveFileMetadata, deleteFileMetadata } from "./db.mjs";

const s3 = new S3Client({ region: process.env.AWS_REGION }); 
const BUCKET = process.env.BUCKET; 

export const uploadToS3 = async ({ file, userId }) => {
    const key = `${userId}/${uuid()}`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key, 
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    console.log("Uploading to S3", { key, userId });

    try {
        await s3.send(command);
        await saveFileMetadata({
          file_name: file.originalname,
          file_size: file.size,
          s3_url: `https://${BUCKET}.s3.amazonaws.com/${key}`,
          upload_timestamp: new Date().toISOString(),
        });
        return { key };
    } catch (error) {
        console.log(error);
        return { error };
    }
};

const getImageKeysByUser = async (userId) => {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: userId,
    });

    const { Contents = [] } = await s3.send(command);
    return Contents.sort(
        (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    ).map((image) => image.Key);
};

export const getUserPresignedUrls = async (userId) => {
    try {
        const imageKeys = await getImageKeysByUser(userId);

        const presignedUrls = await Promise.all(imageKeys.map((key) => {
            const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
            return getSignedUrl(s3, command, { expiresIn: 900 });
        }));

        return { presignedUrls };

    } catch (error) {
        console.log(error);
        return { error };
    }
};


export async function deleteFromS3(key) {
    try {
  
      const command = new DeleteObjectCommand({
        Bucket: process.env.BUCKET,
        Key: key,
      });
  
      await s3.send(command);
  
      return { error: null };
    } catch (error) {
      return { error };
    }
};
