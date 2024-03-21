import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
interface S3Object {
  Bucket: string;
  Key: string;
  Body: File | Blob;
  ContentType: string;
}

const client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadImagesToS3 = async (files: FileList): Promise<string[]> => {
  const imageUrls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const params: S3Object = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: `images/${file.name}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      const data = await client.send(new PutObjectCommand(params));

      console.log("Image uploaded:", data);

      const imageUrl = `https://s3.${process.env.AWS_S3_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${data}`;
      console.log("Image uploaded:", imageUrl);
      imageUrls.push(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
  return imageUrls;
};
