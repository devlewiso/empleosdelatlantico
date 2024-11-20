import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface JobFormProps {
  onSubmit: (post: {
    image: string;
    title: string;
    description: string;
    price: number;
    phone: string;
  }) => void;
}

export function JobForm({ onSubmit }: JobFormProps) {
  const [image, setImage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setImage(imageData);
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image && title && description && price && phone) {
      onSubmit({
        image,
        title,
        description,
        price: Number(price),
        phone,
      });
      setImage('');
      setTitle('');
      setDescription('');
      setPrice('');
      setPhone('');
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        + Nueva Oferta
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nueva Oferta Laboral</h2>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {image ? (
            <div className="relative">
              <img src={image} alt="Preview" className="w-full h-48 object-cover rounded" />
              <button
                type="button"
                onClick={() => setImage('')}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500"
              >
                <Upload size={20} /> Subir Imagen
              </button>
              <button
                type="button"
                onClick={handleCameraCapture}
                className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500"
              >
                <Camera size={20} /> Usar Cámara
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <input
            type="text"
            placeholder="Título del puesto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            placeholder="Descripción del puesto y requisitos"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded h-24"
            required
          />

          <input
            type="number"
            placeholder="Sueldo mensual"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="tel"
            placeholder="Teléfono de contacto"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Publicar Oferta
          </button>
        </div>
      </form>
    </div>
  );
}