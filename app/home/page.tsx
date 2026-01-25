'use client';

import Header from "../component/header";
import { useState, useEffect } from 'react';
import { useFetchNews } from "../hooks/useFetchNews";
import { useFetchMedias } from "../hooks/useFetchMedias";
import { baseUrl } from "../repo/urls";

export default function Home() {
  const [activeTab, setActiveTab] = useState('media');
  const { news, loading, error } = useFetchNews();
  const { media, loading: mediaLoading, fetchMedias, error: mediaError } = useFetchMedias();

  // Fetch media on component mount
  useEffect(() => {
    fetchMedias();
  }, []);

  // Transform API media data to display format
  const displayMediaItems = media.length > 0 ? media.slice(0, 8).map((m) => ({
    id: m.id || m._id,
    type: m.type || 'image',
    title: m.title,
    create_date: m.created_date || "",
    thumbnail: `${baseUrl}/images/${m.image}`,
    desc: m.desc,
    video: m.video
  })) : [];

console.log("med",displayMediaItems)
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
              className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'media'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Gallery & Videos
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'news'
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

            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading news...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            {!loading && !error && news.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No news articles available.</p>
              </div>
            )}

            {!loading && !error && news.length > 0 && (
              <div className="space-y-3">
                {news.map((nw) => (
                  <div key={nw._id} className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">

                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{nw.title}</h3>
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(nw.created_date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',

                      })}
                    </div>
                    <p className="text-xs text-black line-clamp-2">
                      {nw.description}
                    </p>
                    <a href="#" className="text-indigo-600 text-xs font-semibold hover:text-indigo-700 mt-1 inline-block">
                      Read More →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Media (3/4) - Full width on mobile when tab is active */}
          <div className={`col-span-1 lg:col-span-3 ${activeTab === 'news' ? 'hidden lg:block' : 'block'}`}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Gallery & Videos</h2>

            {mediaLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading media...</p>
              </div>
            )}

            {mediaError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm mb-4">
                {mediaError}
              </div>
            )}

            {!mediaLoading && displayMediaItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No media available.</p>
              </div>
            )}

            {!mediaLoading && displayMediaItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {displayMediaItems.map((item) => (
                  item.type == "image" ? <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-60 object-cover"
                      />


                    </div>
                    <div className="p-3">
                      <div className="text-xs text-gray-600 mt-1">Post Date:  {new Date(item.create_date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',

                      })}</div>
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h3>
                      {item.desc && (
                        <p className="text-xs text-gray-600  mt-1">{item.desc}</p>
                      )}
                    </div>
                  </div> :
                    <div className="flex-shrink-0">

                      <div className="bg-black rounded o">
                        <div
                          dangerouslySetInnerHTML={{ __html: item.video || "" }}
                          className="   origin-top-left"
                          style={{
                            width: "100%",
                            height: "100%",

                          }}
                        />
                      </div>
                      <div className="p-3">
                                   <div className="text-xs text-gray-600 mt-1">Post Date:  {new Date(item.create_date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',

                      })}</div>
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h3>
                        {item.desc && (
                          <p className="text-xs text-gray-600  mt-1">{item.desc}</p>
                        )}
                      </div>
                    </div>

                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}