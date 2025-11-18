import React, { useState } from 'react';
// import Header from './Header';
import BlogPosts from './BlogPosts';
import Sidebar from './Sidebar';
import Pagination from './Pagination';
import Features from './Features';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

const BlogPage = () => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');

  return (
    <div className={`min-h-screen bg-gradient-to-br from-dark-purple to-dark-blue text-light-blue ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* <Header search={search} setSearch={setSearch} /> */}
      
      <main className="blog-container-spec">
        <BlogPosts />
        <Sidebar search={search} setSearch={setSearch} />
      </main>

      <Pagination />
      <Features />
      <Footer />
    </div>
  );
};

export default BlogPage;