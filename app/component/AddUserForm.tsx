"use client";

import { useState } from "react";

interface AddUserFormProps {
	onAdd: (user: { name: string; email: string; password: string; mobile: string }) => void;
	onCancel: () => void;
}

export default function AddUserForm({ onAdd, onCancel }: AddUserFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		mobile: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!formData.name.trim()) {
			setError("Name is required");
			return;
		}
		if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			setError("Valid email is required");
			return;
		}
		if (!formData.password.trim() || formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}
		if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
			setError("Valid 10-digit mobile number is required");
			return;
		}

		onAdd(formData);
		setFormData({ name: "", email: "", password: "", mobile: "" });
	};

	return (
		<div className="mb-6 p-4 bg-gray-50 rounded-lg border">
			<h3 className="text-md font-semibold text-gray-800 mb-4">Add New User</h3>
			<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="John Doe"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="john@example.com"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
					<input
						type="tel"
						name="mobile"
						value={formData.mobile}
						onChange={handleChange}
						placeholder="1234567890"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
					/>
				</div>
				{error && <div className="col-span-1 md:col-span-2 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
				<div className="col-span-1 md:col-span-2 flex gap-2">
					<button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
						Add User
					</button>
					<button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
