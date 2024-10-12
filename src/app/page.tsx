"use client"
import { useRouter } from "next/navigation"
 
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

 
export default async function Home() {
 
  const router = useRouter()
  const handleAddImages = ()=>{
    router.push("/upload")
  }
  return (
    <main className="min-h-screen text-white p-12">
     <p className="text-2xl font-bold">Ejemplo de crud con S3</p>
     <button className="bg-white hover:bg-gray-100 rounded p-2 px-3 m-2 mb-24 mt-6 text-gray-600" onClick={()=>{handleAddImages()}}>Subir imagenes</button>


     <p className="text-2xl font-bold" >Imagenes subidas</p>
     <div className="bg-gray-900">
      {/* <Imagen imageSrc={imageSrc}/> */}
     </div>
    </main>
  )
}