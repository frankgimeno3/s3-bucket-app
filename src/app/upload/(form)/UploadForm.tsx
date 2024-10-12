import { useFormState } from "react-dom"; 
import { uploadFile, listObjectsInBucket } from "@/app/upload/(form)/actions"; 
import { SubmitButton } from "./Submit-button";
import { useEffect, useState } from "react";

const initialState = { status: "idle", message: "" }; 
const handleListObjects = async () => {
  await listObjectsInBucket();
};

export function UploadForm() {
  const [state, formAction] = useFormState(uploadFile, initialState);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Estado para almacenar las URLs

  const fetchImageUrls = async () => {
    const urls = await listObjectsInBucket();
    setImageUrls(urls); // Guardamos las URLs en el estado
  };

  return (
    <div className="flex flex-col p-5">
      <form action={formAction}>
        <input type="file" id="file" name="file" accept="images/*" className="p-2" />
        <SubmitButton />
      </form>
      <button onClick={fetchImageUrls} className="mt-4 p-2 bg-blue-500 text-white rounded w-44">
        Listar Objetos en S3
      </button>
      {state?.status && (
        <div className={`text-red`}>
          {state?.message}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-4"> {/* Espacio para las imágenes */}
        {imageUrls.map((url, index) => (
          <div key={index} className="w-44 h-44 rounded shadow overflow-hidden">
            <img src={url} alt={`Uploaded Image ${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
