"use client";

import { baseUrl } from "../repo/urls";
import { Media } from "../types/media";

interface MediaListProps {
	media: Media[];
	loading: boolean;
	error: string | null;
	onUpload: () => void;
	onEdit: (mediaId: string, mediaData: Media) => void;
	onDelete: (mediaId: string) => void;
}

export default function MediaList({ media, loading, error, onUpload, onEdit, onDelete }: MediaListProps) {
	return (
		<div className="bg-white rounded-lg shadow p-4">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-medium text-gray-800">Media Library</h2>
				<button
					onClick={onUpload}
					className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
				>
					Upload
				</button>
			</div>

			{error && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
					{error}
				</div>
			)}

			{loading ? (
				<div className="text-center py-8 text-gray-500">Loading media...</div>
			) : media && media.length > 0 ? (
				<div className="space-y-2">
					{media.map((m) => (
						<div
							key={m.id || m._id}
							className="p-4 border rounded-lg hover:shadow-md transition-shadow"
						>
							<div className="flex gap-4">
								{m.image && (
									<div className="flex-shrink-0">
										<img
											src={`${baseUrl}/images/${m.image}`}
											alt={m.title}
											className="w-20 h-20 object-cover rounded"
										/>
									</div>
								)}
								<div className="flex-1">
									<h3 className="font-semibold text-gray-800">{m.title}</h3>
									<p className="text-sm text-gray-500">
										Type: <span className="font-medium">{m.type}</span>
										{m.createdAt && (
											<>
												{" "}
												• Uploaded:{" "}
												<span className="font-medium">
													{new Date(m.createdAt).toLocaleDateString()}
												</span>
											</>
										)}
									</p>
									{m.desc && (
										<p className="text-sm text-gray-600 mt-2 line-clamp-2">
											{m.desc}
										</p>
									)}
								</div>
								<div className="flex gap-2 flex-shrink-0">
									<button 
										className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
										onClick={() => onEdit((m.id || m._id) as string, m)}
									>
										Edit
									</button>
									<button
										onClick={() => {
											if (
												confirm(
													"Are you sure you want to delete this media?"
												)
											) {
												onDelete((m.id || m._id) as string);
											}
										}}
										className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-500 mb-4">No media uploaded yet.</p>
					<button
						onClick={onUpload}
						className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
					>
						Upload Your First Media
					</button>
				</div>
			)}
		</div>
	);
}
