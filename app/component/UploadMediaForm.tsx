"use client";

import { useState } from "react";
import { useUploadImage } from "../hooks/useUploadImage";
import { useMediaOperations } from "../hooks/useMediaOperations";
import { MediaParams } from "../types/media";

interface UploadMediaFormProps {
	mediaId?: string;
	initialData?: Partial<MediaParams>;
	isEditing?: boolean;
	onSuccess?: (media: any) => void;
	onCancel?: () => void;
}

export default function UploadMediaForm({ 
	mediaId, 
	initialData, 
	isEditing = false,
	onSuccess,
	onCancel 
}: UploadMediaFormProps) {
	const [title, setTitle] = useState(initialData?.title || "");
	const [mediaType, setMediaType] = useState<string>(initialData?.type || "image");
	const [desc, setDesc] = useState(initialData?.desc || "");
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState("");
	const [preview, setPreview] = useState<string>(initialData?.image || "");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { uploadImage, loading: imageLoading } = useUploadImage();
	const { createMedia, updateMedia, loading: mediaLoading } = useMediaOperations();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		setError("");

		if (!selectedFile) {
			setFile(null);
			setPreview("");
			return;
		}

		// Validate file type - only image for now
		const isValidImage = selectedFile.type.startsWith("image/");

		if (!isValidImage) {
			setError("Please select a valid image file");
			setFile(null);
			setPreview("");
			return;
		}

		setFile(selectedFile);

		// Create preview for images
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(selectedFile);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!title.trim()) {
			setError("Title is required");
			return;
		}

		if (!mediaType.trim()) {
			setError("Media type is required");
			return;
		}

		if (!desc.trim()) {
			setError("Description is required");
			return;
		}

		if (!isEditing && !file) {
			setError("Please select an image file");
			return;
		}

		setIsSubmitting(true);

		try {
			let imageUrl: string | null = initialData?.image || "";

			// If a new file is selected, upload it first
			if (file) {
				imageUrl = await uploadImage(file);
				console.log("Uploaded image URL:", imageUrl);
				if (!imageUrl) {
					throw new Error("Image upload failed");
				}
			}

			const mediaData: MediaParams = {
				title: title.trim(),
				type: mediaType.trim(),
				desc: desc.trim(),
				image: imageUrl,
				video: "",
			};

			let result;
			if (isEditing && mediaId) {
				// Update existing media
				result = await updateMedia(mediaId, mediaData);
			} else {
				// Create new media
				result = await createMedia(mediaData);
			}

			if (result) {
				setTitle("");
				setMediaType("image");
				setDesc("");
				setFile(null);
				setPreview("");
				onSuccess?.(result);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "An error occurred";
			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
			<h2 className="text-xl font-semibold text-gray-800">
				{isEditing ? "Edit Media" : "Upload Media"}
			</h2>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Enter media title"
					disabled={isSubmitting}
					className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
				<select
					value={mediaType}
					onChange={(e) => setMediaType(e.target.value)}
					disabled={isSubmitting}
					className="w-full px-3 py-2 border border-gray-300  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
				>
					<option value="image">Image</option>
					<option value="document">Document</option>
					<option value="audio">Audio</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
				<textarea
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
					placeholder="Enter media description"
					disabled={isSubmitting}
					rows={4}
					className="w-full px-3 py-2 border border-gray-300  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
				<input
					type="file"
					onChange={handleFileChange}
					accept="image/*"
					disabled={isSubmitting || imageLoading}
					className="w-full px-3 py-2 border border-gray-300  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
				/>
				<p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WebP</p>
			</div>

			{preview && (
				<div className="mt-3">
					<p className="text-sm text-gray-600 mb-2">Preview:</p>
					<img src={preview} alt="Preview" className="w-full h-40  text-black object-cover rounded-lg border border-gray-300" />
				</div>
			)}

			{file && (
				<div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
					<span className="font-medium">Selected file:</span> {file.name} ({(file.size / 1024).toFixed(2)} KB)
				</div>
			)}

			{error && (
				<div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
			)}

			<div className="flex gap-2 pt-4">
				<button
					type="submit"
					disabled={isSubmitting || imageLoading || mediaLoading}
					className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
				>
					{isSubmitting ? "Processing..." : isEditing ? "Update Media" : "Upload Media"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						disabled={isSubmitting}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
