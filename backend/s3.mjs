import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

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

    try {
        await s3.send(command);
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


// import {
//     S3Client,
//     PutObjectCommand,
//     ListObjectsV2Command,
//     GetObjectCommand,
//     DeleteObjectCommand,
//   } from "@aws-sdk/client-s3";
//   import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//   import { v4 as uuid } from "uuid";
  
//   const s3 = new S3Client({ region: process.env.AWS_REGION });
//   const BUCKET = process.env.BUCKET;
  
//   export const uploadToS3 = async ({ file, userId }) => {
//     const key = `${userId}/${uuid()}`;
//     const command = new PutObjectCommand({
//       Bucket: BUCKET,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     });
  
//     try {
//       await s3.send(command);
//       return { key };
//     } catch (error) {
//       console.log(error);
//       return { error };
//     }
//   };
  
//   const getImageKeysByUser = async (userId) => {
//     const command = new ListObjectsV2Command({
//       Bucket: BUCKET,
//       Prefix: userId,
//     });
  
//     const { Contents = [] } = await s3.send(command);
//     return Contents.sort(
//       (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
//     ).map((image) => image.Key);
//   };
  
//   export const getUserPresignedUrls = async (userId) => {
//     try {
//       const imageKeys = await getImageKeysByUser(userId);
  
//       const presignedUrls = await Promise.all(
//         imageKeys.map((key) => {
//           const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
//           return getSignedUrl(s3, command, { expiresIn: 900 });
//         })
//       );
  
//       return { presignedUrls, keys: imageKeys };
//     } catch (error) {
//       console.log(error);
//       return { error };
//     }
//   };
  
//   // ✅ New function to delete an object from S3
//   export const deleteFromS3 = async (key) => {
//     const command = new DeleteObjectCommand({
//       Bucket: BUCKET,
//       Key: key,
//     });
  
//     try {
//       await s3.send(command);
//       return { success: true };
//     } catch (error) {
//       console.error("Delete error:", error);
//       return { error };
//     }
//   };
  