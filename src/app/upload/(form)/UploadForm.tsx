import { useFormState } from "react-dom";
import { uploadFile } from "@/app/upload/(form)/actions";
import { SubmitButton } from "./Submit-button";

// Asegúrate de que el initialState tenga la propiedad status
const initialState = { status: "idle", message: "" }; // Cambiado de null a ""

export function UploadForm() {
  const [state, formAction] = useFormState(uploadFile, initialState);

  return (
    <div className="flex flex-col p-5">
      <form action={formAction}>
        <input type="file" id="file" name="file" accept="images/*" className="p-2" />
        <SubmitButton />
      </form>
      {state?.status && (
        <div className={`text-red`}>
          {state?.message}
        </div>
      )}
    </div>
  );
}
