import React, { FC } from 'react';
import Image from 'next/image';

interface ImagenProps {
  imageSrc:any;
}

const Imagen: FC<ImagenProps> = ({imageSrc }) => {
  return (
    <div className='bg-white rounded p-5 flex flex-col w-44 justify-center text-center'>
            <div className='w-24 h-24 rounded shadow m-5'>
                <Image src={imageSrc} height={100} width={100} alt='image'/>
            </div>
            <button className='bg-blue-50 hover:bg-blue-100 py-1 m-2 text-gray-500'>Editar</button>
            <button className='bg-blue-50 hover:bg-blue-100 py-1 m-2 text-gray-500'>Eliminar</button>
    </div>
  );
};

export default Imagen;