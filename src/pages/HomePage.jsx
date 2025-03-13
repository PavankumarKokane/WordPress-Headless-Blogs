import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PostCard } from '../components/PostCard';

export function HomePage() {
  const domain = import.meta.env.VITE_WORDPRESS_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  const lastPostRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${domain}/wp-json/wp/v2/posts?per_page=9&page=${page}&_embed`);

        if (!response.ok) throw new Error('Failed to fetch posts');
        
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
        setHasMore(page < totalPages);

        const data = await response.json();
                
        // If page is 1, reset the posts to avoid duplicates
        setPosts(prevPosts => page === 1 ? data : [...prevPosts, ...data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);


  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error: {error}</p>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return <div key={post.id} ref={lastPostRef}><PostCard post={post} /></div>;
          }
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      )}
    </main>
  );
}