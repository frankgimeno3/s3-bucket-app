"use server";

import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

// Definición de tipos para el archivo
interface File {
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
  name: string;
}

// Validación de las variables de entorno
const region = process.env.NEXT_AWS_S3_REGION;
const accessKeyId = process.env.NEXT_AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("AWS S3 configuration is not properly set. Please check your environment variables.");
}

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

async function uploadFileToS3(file: Buffer, fileName: string): Promise<string> {
  const fileBuffer = await sharp(file)
    .jpeg({ quality: 50 })
    .resize(800, 400)
    .toBuffer();

  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME as string, // Asegúrate de que la variable de entorno esté definida
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully:", response);
    return fileName;
  } catch (error) {
    throw error;
  }
}

export async function uploadFile(prevState: any, formData: FormData): Promise<{ status: string; message: string }> {
  try {
    const file = formData.get("file") as File;

    if (file.size === 0) {
      return { status: "error", message: "Please select a file." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadFileToS3(buffer, file.name);

    revalidatePath("/");
    return { status: "success", message: "File has been uploaded." };
  } catch (error) {
    return { status: "error", message: "Failed to upload file." };
  }
}
