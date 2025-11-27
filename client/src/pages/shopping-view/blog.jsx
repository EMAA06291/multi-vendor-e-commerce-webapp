import React, { useState } from 'react';
import BlogPosts from '@/components/shopping-view/blog/BlogPosts';
import Sidebar from '@/components/shopping-view/blog/Sidebar';
import Pagination from '@/components/shopping-view/blog/Pagination';
import Features from '@/components/shopping-view/blog/Features';
import '@/styles/blog.css';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query used for filtering
  const [searchInput, setSearchInput] = useState(''); // Input value in the search bar
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category filter

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  return (
    <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white">
      <main className="blog-container-spec py-10">
        <BlogPosts search={searchQuery} selectedCategory={selectedCategory} />
        <Sidebar 
          searchInput={searchInput} 
          setSearchInput={setSearchInput} 
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </main>

      <Pagination />
      <Features />
    </div>
  );
};

export default BlogPage;

