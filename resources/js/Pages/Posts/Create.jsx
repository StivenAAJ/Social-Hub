import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import classNames from 'classnames';
import { route } from 'ziggy-js';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    content: '',
    image: null,
    scheduled_at: '',
    publish_option: 'immediately', // opción por defecto
  });

  function handleChange(e) {
    const key = e.target.name;
    const value = key === 'image' ? e.target.files[0] : e.target.value;
    setData(key, value);
  }

  function submit(e) {
    e.preventDefault();
    post(route('posts.store'));
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center mb-6 text-gray-700 hover:text-gray-900 transition"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Atrás
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear Post</h1>

      <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label htmlFor="content" className="block font-semibold mb-2 text-gray-700">
            Contenido
          </label>
          <textarea
            id="content"
            name="content"
            value={data.content}
            onChange={handleChange}
            className={classNames(
              'w-full border rounded px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              { 'border-red-500': errors.content }
            )}
            rows={5}
          />
          {errors.content && <p className="mt-1 text-red-600">{errors.content}</p>}
        </div>

        <div>
          <label htmlFor="image" className="block font-semibold mb-2 text-gray-700">
            Imagen (opcional)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={classNames(
              'w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              { 'border-red-500': errors.image }
            )}
          />
          {errors.image && <p className="mt-1 text-red-600">{errors.image}</p>}
        </div>

        <fieldset>
          <legend className="font-semibold mb-2 text-gray-700">Opciones de Publicación</legend>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="publish_option"
                value="immediately"
                checked={data.publish_option === 'immediately'}
                onChange={handleChange}
                className="form-radio text-indigo-600"
              />
              <span>Publicar Inmediatamente</span>
            </label>
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="publish_option"
                value="queued"
                checked={data.publish_option === 'queued'}
                onChange={handleChange}
                className="form-radio text-indigo-600"
              />
              <span>Agregar a Cola</span>
            </label>
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="publish_option"
                value="scheduled"
                checked={data.publish_option === 'scheduled'}
                onChange={handleChange}
                className="form-radio text-indigo-600"
              />
              <span>Agendar para mas tarde</span>
            </label>
          </div>
        </fieldset>

        {data.publish_option === 'scheduled' && (
          <div>
            <label htmlFor="scheduled_at" className="block font-semibold mb-2 text-gray-700">
              Agendado para
            </label>
            <input
              type="datetime-local"
              id="scheduled_at"
              name="scheduled_at"
              value={data.scheduled_at}
              onChange={handleChange}
              className={classNames(
                'w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                { 'border-red-500': errors.scheduled_at }
              )}
            />
            {errors.scheduled_at && <p className="mt-1 text-red-600">{errors.scheduled_at}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={processing}
          className={classNames(
            'bg-indigo-600 text-white font-semibold px-6 py-3 rounded hover:bg-indigo-700 transition',
            { 'opacity-50 cursor-not-allowed': processing }
          )}
        >
          {processing ? 'Creando...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}



