"use client";

import { useState, useEffect } from "react";
import { useAddNews } from "../hooks/useAddNews";
import { useEditNews } from "../hooks/useEditNews";

interface AddNewsFormProps {
	onAdd?: (news: { title: string; summary: string }) => void;
	onCancel: () => void;
	onSuccess?: () => void;
	newsId?: string;
	initialData?: { title: string; summary: string };
}

export default function AddNewsForm({ onAdd, onCancel, onSuccess, newsId, initialData }: AddNewsFormProps) {
	const [formData, setFormData] = useState({
		title: initialData?.title || "",
		summary: initialData?.summary || "",
	});
	const [error, setError] = useState("");
	const { addNews, loading: addLoading } = useAddNews();
	const { editNews, loading: editLoading } = useEditNews();
	const loading = addLoading || editLoading;
	const isEditMode = !!newsId;

	useEffect(() => {
		if (initialData) {
			setFormData({
				title: initialData.title,
				summary: initialData.summary,
			});
		}
	}, [initialData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!formData.title.trim()) {
			setError("Title is required");
			return;
		}
		if (!formData.summary.trim()) {
			setError("Description is required");
			return;
		}
		if (formData.summary.length < 10) {
			setError("Description must be at least 10 characters");
			return;
		}

		// Call appropriate API based on mode
		let success = false;
		if (isEditMode && newsId) {
			success = await editNews(newsId, {
				title: formData.title,
				description: formData.summary,
			});
			if (!success) {
				setError("Failed to edit news. Please try again.");
			}
		} else {
			success = await addNews({
				title: formData.title,
				description: formData.summary,
			});
			if (!success) {
				setError("Failed to add news. Please try again.");
			}
		}

		if (success) {
			// Call legacy onAdd if provided for backward compatibility
			if (onAdd) {
				onAdd(formData);
			}
			// Call success callback and reset form
			if (onSuccess) {
				onSuccess();
			}
			setFormData({ title: "", summary: "" });
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						placeholder="Enter news title"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						name="summary"
						value={formData.summary}
						onChange={handleChange}
						placeholder="Enter news description"
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none text-black"
					/>
				</div>

				{error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

				<div className="flex gap-2">
					<button 
						type="submit" 
						disabled={loading}
						className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update News" : "Create News")}
					</button>
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
				</div>
			</form>
		);
}
