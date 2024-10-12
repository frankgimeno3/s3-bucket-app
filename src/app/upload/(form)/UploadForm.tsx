import { useFormState } from "react-dom"; 
import { uploadFile, listObjectsInBucket } from "@/app/upload/(form)/actions"; 
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
          <div key={index} className="w-44 h-44 rounded shadow overflow-hidden">
            <img src={obj.imageUrl} alt={`Uploaded Image ${index}`} className="w-full h-full object-cover" />
            {/* Opcional: Puedes agregar más información del objeto aquí */}
            <div className="p-2 text-sm text-gray-600">
              <p>Key: {obj.Key}</p>
              <p>Size: {obj.Size} bytes</p>
              <p>ETag: {obj.ETag}</p>
              <p>Last Modified: {obj.LastModified?.toLocaleString()}</p>
              <p>Storage Class: {obj.StorageClass}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
