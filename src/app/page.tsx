"use client"
import { useRouter } from "next/navigation"
import Imagen from "./Imagen"
// import { imagesFeedQuery } from "@/db/queries/imagesFeed"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

 
export default async function Home() {

  // const images = await imagesFeedQuery.execute()

  // const s3Client = new S3Client({
  //   region: process.env.AWS_BUCKET_REGION!,
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY!,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  //   },
  // })

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