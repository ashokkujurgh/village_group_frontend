"use client";

import { useEffect, useState } from "react";
import Header from "../component/header";
import AddUserForm from "../component/AddUserForm";
import UploadMediaForm from "../component/UploadMediaForm";
import AddNewsForm from "../component/AddNewsForm";
import Dialog from "../component/Dialog";
import UserList from "../component/UserList";
import NewsList from "../component/NewsList";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useFetchNews } from "../hooks/useFetchNews";



const initialMedia = [
	{ id: 1, title: "Event Photo 1", type: "image", uploaded: "2026-01-10" },
	{ id: 2, title: "Promo Video", type: "video", uploaded: "2026-01-12" },
	{ id: 3, title: "Flyer PDF", type: "document", uploaded: "2026-01-15" },
];


export default function AdminPage() {
	const { users, loading,fetchUsers, error } = useFetchUsers();
	const { news: newsData, loading: newsLoading, fetchNews, error: newsError } = useFetchNews();
	const [media, setMedia] = useState(initialMedia);
	const [newsItems, setNewsItems] = useState<any[]>([]);
	const [active, setActive] = useState("Users");
	const [showAddForm, setShowAddForm] = useState(false);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [showNewsForm, setShowNewsForm] = useState(false);
	const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
	const [editingNewsData, setEditingNewsData] = useState<any>(null);

	const tabs = ["Users", "Media", "News"];

	const handleAddUser = (newUserData: { name: string; email: string; password: string; mobile: string }) => {
		fetchUsers();
		setShowAddForm(false);
	};
    const onDeleteUserSuccess = () => {
		fetchUsers();
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
		// TODO: Implement delete news API call
		// For now, just refresh the news list
		fetchNews();
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
	}, []);

	useEffect(() => {
		if (newsData && newsData.length > 0) {
			setNewsItems(newsData);
		}
	}, [newsData]);
	const handleUploadMedia = (mediaData: { title: string; type: "image" | "video"; file: File }) => {
		const newMedia = {
			id: media.length + 1,
			title: mediaData.title,
			type: mediaData.type,
			uploaded: new Date().toISOString().split("T")[0],
		};
		setMedia([...media, newMedia]);
		setShowUploadForm(false);
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

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-7xl mx-auto p-6">
				<h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

				<div className="mb-6">
					<nav className="flex gap-2 border-b">
						{tabs.map((t) => (
							<button
								key={t}
								onClick={() => setActive(t)}
								className={`px-4 py-2 -mb-px ${
									active === t
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
						<div className="bg-white rounded-lg shadow p-4">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-medium text-gray-800">Media Library</h2>
								<div className="flex items-center gap-2">
								<button onClick={() => setShowUploadForm(true)} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Upload</button>
								<button className="px-3 py-2 border rounded hover:bg-gray-50">Manage</button>
							</div>
						</div>

							<ul className="divide-y">
								{media.map((m) => (
									<li key={m.id} className="p-3 flex items-center justify-between">
										<div>
											<div className="font-medium">{m.title}</div>
											<div className="text-sm text-gray-500">{m.type} • Uploaded {m.uploaded}</div>
										</div>
										<div className="flex gap-2">
											<button className="text-indigo-600 hover:underline">Edit</button>
											<button className="text-red-600 hover:underline">Delete</button>
										</div>
									</li>
								))}
							</ul>
						</div>
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
			</main>

			{/* Add User Dialog */}
			<Dialog isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add New User">
				<AddUserForm onAdd={handleAddUser} onCancel={() => setShowAddForm(false)} />
			</Dialog>

			{/* Upload Media Dialog */}
			<Dialog isOpen={showUploadForm} onClose={() => setShowUploadForm(false)} title="Upload Media">
				<UploadMediaForm onUpload={handleUploadMedia} onCancel={() => setShowUploadForm(false)} />
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
		</div>
	);
}

