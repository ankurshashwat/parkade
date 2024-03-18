import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const s3 = new AWS.S3();

export const uploadImagesToS3 = async (files: FileList) => {
  const imageUrls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: `images/${file.name}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      const data = await s3.upload(params).promise();
      console.log("Image uploaded:", data.Location);
      imageUrls.push(data.Location);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
  return imageUrls;
};
