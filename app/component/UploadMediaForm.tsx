"use client";

import { useState } from "react";

interface UploadMediaFormProps {
	onUpload: (media: { title: string; type: "image" | "video"; file: File }) => void;
	onCancel: () => void;
}

export default function UploadMediaForm({ onUpload, onCancel }: UploadMediaFormProps) {
	const [title, setTitle] = useState("");
	const [mediaType, setMediaType] = useState<"image" | "video">("image");
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState("");
	const [preview, setPreview] = useState<string>("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		setError("");

		if (!selectedFile) {
			setFile(null);
			setPreview("");
			return;
		}

		// Validate file type
		const isValidImage = mediaType === "image" && selectedFile.type.startsWith("image/");
		const isValidVideo = mediaType === "video" && selectedFile.type.startsWith("video/");

		if (!isValidImage && !isValidVideo) {
			setError(`Please select a valid ${mediaType} file`);
			setFile(null);
			setPreview("");
			return;
		}

		setFile(selectedFile);

		// Create preview for images
		if (mediaType === "image") {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(selectedFile);
		} else {
			setPreview("");
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!title.trim()) {
			setError("Title is required");
			return;
		}

		if (!file) {
			setError(`Please select a ${mediaType} file`);
			return;
		}

		onUpload({ title, type: mediaType, file });
		setTitle("");
		setFile(null);
		setPreview("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Enter media title"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>

				<div className="flex items-center gap-4">
					<span className="text-sm font-medium text-gray-700">Media Type:</span>
					<div className="flex items-center gap-2 bg-white border rounded-lg p-1">
						<button
							type="button"
							onClick={() => {
								setMediaType("image");
								setFile(null);
								setPreview("");
								setError("");
							}}
							className={`px-4 py-2 rounded transition-colors ${
								mediaType === "image"
									? "bg-indigo-600 text-white"
									: "bg-gray-50 text-gray-700 hover:bg-gray-100"
							}`}
						>
							🖼️ Image
						</button>
						<button
							type="button"
							onClick={() => {
								setMediaType("video");
								setFile(null);
								setPreview("");
								setError("");
							}}
							className={`px-4 py-2 rounded transition-colors ${
								mediaType === "video"
									? "bg-indigo-600 text-white"
									: "bg-gray-50 text-gray-700 hover:bg-gray-100"
							}`}
						>
							🎬 Video
						</button>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{mediaType === "image" ? "Select Image" : "Select Video"}
					</label>
					<input
						type="file"
						onChange={handleFileChange}
						accept={mediaType === "image" ? "image/*" : "video/*"}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>

				{preview && (
					<div className="mt-3">
						<img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
					</div>
				)}

				{file && (
					<div className="text-sm text-gray-600">
						<span className="font-medium">Selected file:</span> {file.name}
					</div>
				)}

				{error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

				<div className="flex gap-2 pt-4">
					<button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
						Upload Media
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
		);
}
