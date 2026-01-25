"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddUserForm from "../component/AddUserForm";
import UploadMediaForm from "../component/UploadMediaForm";
import AddNewsForm from "../component/AddNewsForm";
import Dialog from "../component/Dialog";
import UserList from "../component/UserList";
import MediaList from "../component/MediaList";
import NewsList from "../component/NewsList";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useFetchNews } from "../hooks/useFetchNews";
import { useFetchMedias } from "../hooks/useFetchMedias";
import { useDeleteNews } from "../hooks/useDeleteNews";
import { useDeleteMedia } from "../hooks/useDeleteMedia";
import { useEditMedia } from "../hooks/useEditMedia";

export default function AdminContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { users, loading, fetchUsers, error } = useFetchUsers();
    const { news: newsData, loading: newsLoading, fetchNews, error: newsError } = useFetchNews();
    const { media, loading: mediaLoading, fetchMedias, error: mediaError } = useFetchMedias();
    const { deleteMedia } = useDeleteMedia();
    const { editMedia } = useEditMedia();
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [active, setActive] = useState("Users");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [showNewsForm, setShowNewsForm] = useState(false);
    const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
    const [editingMediaData, setEditingMediaData] = useState<any>(null);
    const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
    const [editingNewsData, setEditingNewsData] = useState<any>(null);

    const tabs = ["Users", "Media", "News"];

    useEffect(() => {
        const tab = searchParams.get("tab") || "Users";
        if (tabs.includes(tab)) {
            setActive(tab);
        }
    }, [searchParams]);

    const handleAddUser = (newUserData: { name: string; email: string; password: string; mobile: string }) => {
        fetchUsers();
        setShowAddForm(false);
    };

    const onDeleteUserSuccess = () => {
        fetchUsers();
    };

    const { deleteNews } = useDeleteNews();

    const handleTabChange = (tab: string) => {
        setActive(tab);
        router.push(`/admin?tab=${tab}`);
    };

    const handleEditNews = (newsId: string, newsData: any) => {
        setEditingNewsId(newsId);
        setEditingNewsData({
            title: newsData.title,
            summary: newsData.summary || newsData.description,
        });
        setShowNewsForm(true);
    };

    const handleDeleteNews = async (newsId: string) => {
        const success = await deleteNews(newsId);
        if (success) {
            fetchNews();
        }
    };

    const handleNewsFormSuccess = () => {
        fetchNews();
        setShowNewsForm(false);
        setEditingNewsId(null);
        setEditingNewsData(null);
    };

    useEffect(() => {
        fetchUsers();
        fetchNews();
        fetchMedias();
    }, []);

    useEffect(() => {
        if (newsData && newsData.length > 0) {
            setNewsItems(newsData);
        }
    }, [newsData]);

    const handleUploadMedia = (mediaData: { title: string; type: "image" | "video"; file: File }) => {
        fetchMedias();
        setShowUploadForm(false);
    };

    const handleDeleteMedia = async (mediaId: string) => {
        const success = await deleteMedia(mediaId);
        if (success) {
            fetchMedias();
        }
    };

    const handleEditMedia = (mediaId: string, mediaData: any) => {
        setEditingMediaId(mediaId);
        setEditingMediaData({
            title: mediaData.title,
            type: mediaData.type,
            desc: mediaData.desc,
            image: mediaData.image,
            video: mediaData.video,
        });
        setShowUploadForm(true);
    };

    const handleAddNews = (newsData: { title: string; summary: string }) => {
        const newNews = {
            id: newsItems.length + 1,
            title: newsData.title,
            summary: newsData.summary,
            date: new Date().toISOString().split("T")[0],
        };
        setNewsItems([...newsItems, newNews]);
        setShowNewsForm(false);
    };
     const handleLogout = () => {
        // Clear token from localStorage
        localStorage.removeItem("authToken");
        
        // Clear token from cookies
        document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
        
        // Redirect to login page
        router.push("/login");
    };

    return (
        <main className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
            <div className="mb-6">
                <nav className="flex gap-2 border-b">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => handleTabChange(t)}
                            className={`px-4 py-2 -mb-px ${active === t
                                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                                : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </nav>
            </div>

            <section>
                {active === "Users" && (
                    <UserList
                        users={users}
                        loading={loading}
                        error={error}
                        onDeleteSuccess={onDeleteUserSuccess}
                        onAddUser={() => setShowAddForm(true)}
                    />
                )}

                {active === "Media" && (
                    <MediaList
                        media={media}
                        loading={mediaLoading}
                        error={mediaError}
                        onUpload={() => {
                            setEditingMediaId(null);
                            setEditingMediaData(null);
                            setShowUploadForm(true);
                        }}
                        onEdit={handleEditMedia}
                        onDelete={handleDeleteMedia}
                    />
                )}

                {active === "News" && (
                    <NewsList
                        newsItems={newsItems}
                        loading={newsLoading}
                        error={newsError}
                        onCreateNews={() => {
                            setEditingNewsId(null);
                            setEditingNewsData(null);
                            setShowNewsForm(true);
                        }}
                        onEditNews={handleEditNews}
                        onDeleteNews={handleDeleteNews}
                    />
                )}
            </section>

            {/* Add User Dialog */}
            <Dialog isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add New User">
                <AddUserForm onAdd={handleAddUser} onCancel={() => setShowAddForm(false)} />
            </Dialog>

            {/* Upload Media Dialog */}
            <Dialog isOpen={showUploadForm} onClose={() => {
                setShowUploadForm(false);
                setEditingMediaId(null);
                setEditingMediaData(null);
            }} title={editingMediaId ? "Edit Media" : "Upload Media"}>
                <UploadMediaForm
                    mediaId={editingMediaId || undefined}
                    initialData={editingMediaData || undefined}
                    isEditing={!!editingMediaId}
                    onSuccess={() => {
                        fetchMedias();
                        setShowUploadForm(false);
                        setEditingMediaId(null);
                        setEditingMediaData(null);
                    }}
                    onCancel={() => {
                        setShowUploadForm(false);
                        setEditingMediaId(null);
                        setEditingMediaData(null);
                    }}
                />
            </Dialog>

            {/* Create/Edit News Dialog */}
            <Dialog isOpen={showNewsForm} onClose={() => setShowNewsForm(false)} title={editingNewsId ? "Edit News Article" : "Create News Article"}>
                <AddNewsForm
                    newsId={editingNewsId || undefined}
                    initialData={editingNewsData || undefined}
                    onAdd={handleAddNews}
                    onCancel={() => {
                        setShowNewsForm(false);
                        setEditingNewsId(null);
                        setEditingNewsData(null);
                    }}
                    onSuccess={handleNewsFormSuccess}
                />
            </Dialog>
        </main>
    );
}