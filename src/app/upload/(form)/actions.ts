"use server";

import { revalidatePath } from "next/cache";
 import sharp from "sharp";
import {ListObjectsV2Command, S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";  

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
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME as string,  
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
export async function listObjectsInBucket(): Promise<{ 
  Key: string; 
  LastModified: Date; 
  ETag: string; 
  Size: number; 
  StorageClass: string; 
  imageUrl: string; 
}[]> { // Cambiado el tipo de retorno
  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME as string,
  };

  const command = new ListObjectsV2Command(params);
  const imageObjects: { 
    Key: string; 
    LastModified: Date; 
    ETag: string; 
    Size: number; 
    StorageClass: string; 
    imageUrl: string; 
  }[] = []; // Inicializamos un array para almacenar los objetos

  try {
    const response = await s3Client.send(command);
    if (response.Contents) {
      response.Contents.forEach((object) => {
        // Asegúrate de que el objeto tenga una extensión de imagen válida
        if (object.Key && (object.Key.endsWith('.jpg') || object.Key.endsWith('.jpeg') || object.Key.endsWith('.png'))) {
          const imageUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${object.Key}`;
          
          // Agregamos el objeto con todos sus datos al array
          imageObjects.push({
            Key: object.Key,
            LastModified: object.LastModified ?? new Date(), // Valor predeterminado si es undefined
            ETag: object.ETag ?? '', // Valor predeterminado si es undefined
            Size: object.Size ?? 0, // Valor predeterminado si es undefined
            StorageClass: object.StorageClass ?? 'STANDARD', // Valor predeterminado si es undefined
            imageUrl: imageUrl,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error listing objects:", error);
  }

  return imageObjects; 
}


export async function deleteObjectFromS3(key: string): Promise<void> {
  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME as string,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
    console.log(`Object ${key} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting object:", error);
    throw new Error(`Failed to delete object: ${error}`);
  }
}

export async function editObjectInS3(key: string, fileBuffer: Buffer): Promise<void> {
  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME as string,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const putCommand = new PutObjectCommand(params);
  try {
    await s3Client.send(putCommand);
    console.log("File edited successfully:", key);
  } catch (error) {
    throw new Error(`Failed to edit object: ${error}`);
  }
}