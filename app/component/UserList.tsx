import { useDeleteUser } from "../hooks/useDeleteUser";

interface UserListProps {
	users: any[];
	loading: boolean;
	error: string | null;
	onAddUser: () => void;
	onDeleteSuccess?: () => void;
}

export default function UserList({ users, loading, error, onAddUser, onDeleteSuccess }: UserListProps) {
	const { deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();

	const handleDelete = async (userId: string) => {
		if (confirm("Are you sure you want to delete this user?")) {
			const success = await deleteUser(userId);
			if (success) {
				if (onDeleteSuccess) {
					onDeleteSuccess();
				}
			}
		}
	};
    return (
		<div className="bg-white rounded-lg shadow p-4">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-medium text-gray-800">Users</h2>
				<div className="flex items-center gap-2">
					<button 
						onClick={onAddUser} 
						className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
					>
						Add User
					</button>
				</div>
			</div>

			{loading ? (
				<div className="text-center py-8 text-gray-500">Loading users...</div>
			) : error ? (
				<div className="text-center py-8 text-red-500">{error}</div>
			) : (
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
								<tr key={u._id} className="bg-white">
									<td className="p-3 text-gray-600">{u.full_name}</td>
									<td className="p-3 text-gray-600">{u.email_id}</td>
									<td className="p-3 text-gray-600">{u.role}</td>
									<td className="p-3">
										<div className="flex gap-2">
											<button 
												onClick={() => handleDelete(u._id)}
												disabled={deleteLoading}
												className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{deleteLoading ? "Deleting..." : "Delete"}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
