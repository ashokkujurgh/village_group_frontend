'use client';

import Header from "../component/header";
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('media');
  
  // Sample media data
  const mediaItems = [
    { id: 1, type: 'image', title: 'Community Event', thumbnail: 'https://via.placeholder.com/300x200?text=Event+Photo' },
    { id: 2, type: 'video', title: 'Festival Highlights', thumbnail: 'https://via.placeholder.com/300x200?text=Festival+Video' },
    { id: 3, type: 'image', title: 'Village Life', thumbnail: 'https://via.placeholder.com/300x200?text=Village+Photo' },
    { id: 4, type: 'video', title: 'Cultural Performance', thumbnail: 'https://via.placeholder.com/300x200?text=Performance+Video' },
    { id: 5, type: 'image', title: 'Market Day', thumbnail: 'https://via.placeholder.com/300x200?text=Market' },
    { id: 6, type: 'video', title: 'Local News', thumbnail: 'https://via.placeholder.com/300x200?text=Local+News' },
  ];

  // Sample news data
  const newsItems = [
    { id: 1, title: 'New Community Center Opened', summary: 'The newly built community center is now open for all residents.', date: '2026-01-15' },
    { id: 2, title: 'Annual Festival Scheduled', summary: 'Join us for the annual village festival happening next month.', date: '2026-01-12' },
    { id: 3, title: 'New Roads Being Built', summary: 'Infrastructure development project starts this spring.', date: '2026-01-10' },
    { id: 4, title: 'Water Supply Project', summary: 'New water supply system installation begins next week.', date: '2026-01-08' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="relative w-full mx-auto mt-2">
      </div>

      {/* Main Container with 2 columns - 1/4 and 3/4 */}
      <div className="max-w-7xl mx-auto px-4 py-1">
        {/* Mobile Tabs - Hidden on lg screens */}
        <div className="lg:hidden mb-6">
          <div className="flex border-b border-gray-300">
           
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'media'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Gallery & Videos
            </button>
             <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'news'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Latest News
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section - News (1/4) - Hidden on mobile unless tab is active */}
          <div className={`col-span-1 ${activeTab === 'media' ? 'hidden lg:block' : 'block'}`}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Latest News</h2>
            <div className="space-y-3">
              {newsItems.map((news) => (
                <div key={news.id} className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">{news.date}</div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{news.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{news.summary}</p>
                  <a href="#" className="text-indigo-600 text-xs font-semibold hover:text-indigo-700 mt-1 inline-block">
                    Read More →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Media (3/4) - Full width on mobile when tab is active */}
          <div className={`col-span-1 lg:col-span-3 ${activeTab === 'news' ? 'hidden lg:block' : 'block'}`}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Gallery & Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {item.type === 'video' ? (
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        ) : (
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                      {item.type === 'video' ? '🎥' : '🖼️'}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}