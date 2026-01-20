"use client";

import { useState } from "react";
import { useAddUser } from "../hooks/useAddUser";

interface AddUserFormProps {
	onAdd?: (user: any) => void;
	onCancel: () => void;
}

export default function AddUserForm({ onAdd, onCancel }: AddUserFormProps) {
	const { addUser, loading, error: apiError } = useAddUser();
	const [formData, setFormData] = useState({
		full_name: "",
		email_id: "",
		password: "",
		role:"admin"
	});
	const [formError, setFormError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");

		// Validation
		if (!formData.full_name.trim()) {
			setFormError("Name is required");
			return;
		}
		if (!formData.email_id.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)) {
			setFormError("Valid email is required");
			return;
		}
		if (!formData.password.trim() || formData.password.length < 6) {
			setFormError("Password must be at least 6 characters");
			return;
		}

		const result = await addUser(formData);
		
		if (result) {
			// Success - call onAdd callback if provided
			if (onAdd) {
				onAdd(result);
			}
			setFormData({ full_name: "", email_id: "", password: "", role: "admin" });
			onCancel(); // Close the dialog
		}
	};

	const displayError = formError || apiError;

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
					<input
						type="text"
						name="full_name"
						value={formData.full_name}
						onChange={handleChange}
						placeholder="John Doe"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						name="email_id"
						value={formData.email_id}
						onChange={handleChange}
						placeholder="john@example.com"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="••••••••"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>
				{displayError && <div className="col-span-1 md:col-span-2 text-sm text-red-600 bg-red-50 p-2 rounded">{displayError}</div>}
				<div className="col-span-1 md:col-span-2 flex gap-2">
					<button 
						type="submit" 
						disabled={loading}
						className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
					>
						{loading ? "Adding..." : "Add User"}
					</button>
					<button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
						Cancel
					</button>
				</div>
		</form>
	);
}
