"use client";

import { useState } from "react";
import Header from "../component/header";
import AddUserForm from "../component/AddUserForm";
import UploadMediaForm from "../component/UploadMediaForm";
import AddNewsForm from "../component/AddNewsForm";

const initialUsers = [
	{ id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
	{ id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor" },
	{ id: 3, name: "Carmen Diaz", email: "carmen@example.com", role: "Viewer" },
];

const initialMedia = [
	{ id: 1, title: "Event Photo 1", type: "image", uploaded: "2026-01-10" },
	{ id: 2, title: "Promo Video", type: "video", uploaded: "2026-01-12" },
	{ id: 3, title: "Flyer PDF", type: "document", uploaded: "2026-01-15" },
];

const news = [
	{ id: 1, title: "New Feature Launched", summary: "We rolled out the new editor.", date: "2026-01-05" },
	{ id: 2, title: "Maintenance Notice", summary: "Scheduled maintenance on Jan 20.", date: "2026-01-12" },
];

export default function AdminPage() {
	const [users, setUsers] = useState(initialUsers);
	const [media, setMedia] = useState(initialMedia);
	const [newsItems, setNewsItems] = useState(news);
	const [active, setActive] = useState("Users");
	const [showAddForm, setShowAddForm] = useState(false);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [showNewsForm, setShowNewsForm] = useState(false);
	const [formData, setFormData] = useState({ name: "", email: "", password: "", mobile: "" });
	const [formError, setFormError] = useState("");
	const tabs = ["Users", "Media", "News"];

	const handleAddUser = (newUserData: { name: string; email: string; password: string; mobile: string }) => {
		const newUser = {
			id: users.length + 1,
			name: newUserData.name,
			email: newUserData.email,
			role: "Viewer",
		};
		setUsers([...users, newUser]);
		setShowAddForm(false);
	};

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
						<div className="bg-white rounded-lg shadow p-4">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-medium text-gray-800">Users</h2>
								<div className="flex items-center gap-2">
									<button onClick={() => setShowAddForm(!showAddForm)} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add User</button>
									<button className="px-3 py-2 border rounded hover:bg-gray-50">Export</button>
								</div>
							</div>

							{showAddForm && (
								<AddUserForm onAdd={handleAddUser} onCancel={() => setShowAddForm(false)} />
							)}

							<div className="overflow-x-auto">
								<table className="min-w-full text-sm text-left">
									<thead className="text-gray-600 bg-gray-50">
										<tr>
											<th className="p-3">Name</th>
											<th className="p-3">Email</th>
											<th className="p-3">Role</th>
											<th className="p-3">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										{users.map((u) => (
											<tr key={u.id} className="bg-white">
												<td className="p-3">{u.name}</td>
												<td className="p-3 text-gray-600">{u.email}</td>
												<td className="p-3">{u.role}</td>
												<td className="p-3">
													<div className="flex gap-2">
														<button className="text-indigo-600 hover:underline">Edit</button>
														<button className="text-red-600 hover:underline">Delete</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{active === "Media" && (
						<div className="bg-white rounded-lg shadow p-4">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-medium text-gray-800">Media Library</h2>
								<div className="flex items-center gap-2">
									<button onClick={() => setShowUploadForm(!showUploadForm)} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Upload</button>
									<button className="px-3 py-2 border rounded hover:bg-gray-50">Manage</button>
								</div>
							</div>

							{showUploadForm && (
								<UploadMediaForm onUpload={handleUploadMedia} onCancel={() => setShowUploadForm(false)} />
							)}

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
						<div className="bg-white rounded-lg shadow p-4">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-medium text-gray-800">News</h2>
								<div className="flex items-center gap-2">
									<button onClick={() => setShowNewsForm(!showNewsForm)} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create</button>
								</div>
							</div>

							{showNewsForm && (
								<AddNewsForm onAdd={handleAddNews} onCancel={() => setShowNewsForm(false)} />
							)}

							<ul className="divide-y">
								{newsItems.map((n) => (
									<li key={n.id} className="p-3">
										<div className="flex items-start justify-between">
											<div>
												<div className="font-medium">{n.title}</div>
												<div className="text-sm text-gray-600">{n.summary}</div>
												<div className="text-xs text-gray-400 mt-1">{n.date}</div>
											</div>
											<div className="flex gap-2">
												<button className="text-indigo-600 hover:underline">Edit</button>
												<button className="text-red-600 hover:underline">Delete</button>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}

