import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Natural Remedy Blog</h1>
          </Link>
        </div>
      </header>

      <Outlet />

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Natural Remedy Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}