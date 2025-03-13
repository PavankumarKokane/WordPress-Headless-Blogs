import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

export function PostPage() {
  const domain = import.meta.env.VITE_WORDPRESS_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${domain}/wp-json/wp/v2/posts/${id}?_embed`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error: {error || 'Post not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const fallbackImage = "https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={featuredImage || fallbackImage}
            alt={post.title.rendered}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
        </div>
        
        <div className="p-8">
          <h1 
            className="text-4xl font-bold mb-6 text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>5 min read</span>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 hover:prose-a:text-emerald-700"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </article>
    </main>
  );
}