import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PostCard({ post }) {
  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  console.log(featuredImage);
  const fallbackImage = "https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden">
        <img
          src={featuredImage || fallbackImage}
          alt={post.title.rendered}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
      </div>
      <div className="p-6">
        <h2 
          className="text-2xl font-bold mb-3 text-gray-800 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
          className="text-gray-600 mb-4 line-clamp-3 prose prose-sm"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <Link
          to={`/post/${post.id}`}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}