"use client";

import { useState } from "react";

interface AddNewsFormProps {
	onAdd: (news: { title: string; summary: string }) => void;
	onCancel: () => void;
}

export default function AddNewsForm({ onAdd, onCancel }: AddNewsFormProps) {
	const [formData, setFormData] = useState({
		title: "",
		summary: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
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

		onAdd(formData);
		setFormData({ title: "", summary: "" });
	};

	return (
		<div className="mb-6 p-4 bg-gray-50 rounded-lg border">
			<h3 className="text-md font-semibold text-gray-800 mb-4">Create News Article</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						placeholder="Enter news title"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
					/>
				</div>

				{error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

				<div className="flex gap-2">
					<button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
						Create News
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
