import { useFormState } from "react-dom"; 
import { uploadFile, listObjectsInBucket, deleteObjectFromS3 } from "@/app/upload/(form)/actions"; 
import { SubmitButton } from "./Submit-button";
import { useState } from "react";

const initialState = { status: "idle", message: "" }; 

export function UploadForm() {
  const [state, formAction] = useFormState(uploadFile, initialState);
  const [imageObjects, setImageObjects] = useState<{
    Key: string; 
    LastModified: Date; 
    ETag: string; 
    Size: number; 
    StorageClass: string; 
    imageUrl: string; 
  }[]>([]); // Estado para almacenar los objetos de imagen

  const fetchImageObjects = async () => {
    const objects = await listObjectsInBucket();
    setImageObjects(objects); // Guardamos los objetos en el estado
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteObjectFromS3(key);
      // Recargar la página después de eliminar el objeto
      window.location.reload();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  

  return (
    <div className="flex flex-col p-5">
      <form action={formAction}>
        <input type="file" id="file" name="file" accept="images/*" className="p-2" />
        <SubmitButton />
      </form>
      <button onClick={fetchImageObjects} className="mt-4 p-2 bg-blue-500 text-white rounded w-44">
        Listar Objetos en S3
      </button>
      {state?.status && (
        <div className={`text-red`}>
          {state?.message}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-4"> {/* Espacio para las imágenes */}
        {imageObjects.map((obj, index) => (
          <div key={index} className="w-44 h-44 rounded shadow overflow-hidden relative">
            <img src={obj.imageUrl} alt={`Uploaded Image ${index}`} className="w-full h-full object-cover" />
            <div className="p-2 text-sm text-gray-600">
              <p>Key: {obj.Key}</p>
              <p>Size: {obj.Size} bytes</p>
              <p>ETag: {obj.ETag}</p>
              <p>Last Modified: {obj.LastModified?.toLocaleString()}</p>
              <p>Storage Class: {obj.StorageClass}</p>
            </div>
            <button 
              onClick={() => handleDelete(obj.Key)} 
              className="absolute bottom-2 right-2 p-1 bg-red-500 text-white rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
