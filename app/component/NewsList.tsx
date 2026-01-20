"use client";

import { useState } from "react";

interface NewsItem {
	id?: string;
	_id?: string;
	title: string;
	summary?: string;
	description?: string;
	date?: string;
	[key: string]: any;
}

interface NewsListProps {
	newsItems: NewsItem[];
	loading: boolean;
	error: string | null;
	onCreateNews: () => void;
	onEditNews: (newsId: string, newsData: NewsItem) => void;
	onDeleteNews?: (newsId: string) => void;
}

export default function NewsList({ newsItems, loading, error, onCreateNews, onEditNews, onDeleteNews }: NewsListProps) {
	const [editingId, setEditingId] = useState<string | null>(null);

	const handleEditClick = (newsItem: NewsItem) => {
		setEditingId(newsItem._id || newsItem.id || null);
		onEditNews(newsItem._id || newsItem.id || "", newsItem);
	};

	const handleDeleteClick = (newsId: string) => {
		if (confirm("Are you sure you want to delete this news?")) {
			if (onDeleteNews) {
				onDeleteNews(newsId);
			}
		}
	};
	return (	<div className="bg-white rounded-lg shadow p-4">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-medium text-gray-800">News</h2>
				<div className="flex items-center gap-2">
					<button 
						onClick={onCreateNews} 
						className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
					>
						Create
					</button>
				</div>
			</div>

			{loading ? (
				<div className="text-center py-8 text-gray-500">Loading news...</div>
			) : error ? (
				<div className="text-center py-8 text-red-500">{error}</div>
			) : (
				<ul className="divide-y">
					{newsItems.map((n) => (
						<li key={n._id || n.id} className="p-3">
							<div className="flex items-start justify-between">
								<div>
									<div className="font-medium text-black">Title: {n.title}</div>
									<div className="text-sm text-gray-700">{n.summary || n.description}</div>
									<div className="text-xs text-gray-600 mt-1">Created Date: {n.date}</div>
								</div>
								<div className="flex gap-2">
								<button 
									onClick={() => handleEditClick(n)}
									className="text-indigo-600 hover:underline"
								>
									Edit
								</button>
								<button 
									onClick={() => handleDeleteClick(n._id || n.id || "")}
									className="text-red-600 hover:underline"
								>
									Delete
								</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
