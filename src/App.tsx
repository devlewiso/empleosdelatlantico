import React from 'react';
import { JobForm } from './components/JobForm';
import { JobPost as JobPostComponent } from './components/JobPost';
import { useJobPosts } from './hooks/useJobPosts';
import { BriefcaseIcon } from 'lucide-react';

function App() {
  const { posts, addPost, likePost, reportPost } = useJobPosts();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="text-blue-500" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">Empleos del Atlántico</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Plataforma de uso libre para publicación de ofertas laborales. 
            Por favor abstenerse de publicar contenido inapropiado o sexual. 
            Todo el contenido será monitoreado y podrá ser eliminado.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <JobPostComponent
              key={post.id}
              post={post}
              onLike={likePost}
              onReport={reportPost}
            />
          ))}
        </div>
        {posts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No hay ofertas disponibles. ¡Sé el primero en publicar una!
          </div>
        )}
        <JobForm onSubmit={addPost} />
      </main>
    </div>
  );
}

export default App;