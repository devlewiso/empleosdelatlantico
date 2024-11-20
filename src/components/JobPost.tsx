import React, { useState } from 'react';
import { Heart, Flag } from 'lucide-react';
import { JobPost as JobPostType } from '../types';
import { ImageModal } from './ImageModal';

interface JobPostProps {
  post: JobPostType;
  onLike: (id: string) => void;
  onReport: (id: string) => void;
}

export function JobPost({ post, onLike, onReport }: JobPostProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);

  const timeAgo = () => {
    const seconds = Math.floor((Date.now() - post.timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return '24h';
  };

  const handleReport = () => {
    onReport(post.id);
    setShowReportConfirm(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => setShowImageModal(true)}
        />
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-600 mb-2">{post.description}</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-green-600">
              Sueldo: ${post.price.toLocaleString()}/mes
            </span>
            <a
              href={`tel:${post.phone}`}
              className="text-blue-500 hover:text-blue-700"
            >
              {post.phone}
            </a>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex gap-4">
              <button
                onClick={() => onLike(post.id)}
                className="flex items-center gap-1 text-pink-500 hover:text-pink-700"
              >
                <Heart size={16} fill={post.likes > 0 ? 'currentColor' : 'none'} />
                {post.likes}
              </button>
              <button
                onClick={() => setShowReportConfirm(true)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500"
              >
                <Flag size={16} />
                Reportar
              </button>
            </div>
            <span>{timeAgo()}</span>
          </div>
        </div>
      </div>

      {showImageModal && (
        <ImageModal
          imageUrl={post.image}
          alt={post.title}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {showReportConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reportar Publicación</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas reportar esta publicación por contenido inapropiado?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReportConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}