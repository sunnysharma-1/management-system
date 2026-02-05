'use client';

import { useState } from 'react';
import { useAuth, User } from './providers/auth-context';
import { Users, Plus, Edit, Trash2, Check, User as UserIcon, Shield } from 'lucide-react';

export function UserManagement() {
    const { allUsers, allRoles, createUser, updateUser, deleteUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState('');

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setName(user.name);
        setUsername(user.username);
        setPassword(user.password || '');
        setSelectedRoleId(user.roleId);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setName('');
        setUsername('');
        setPassword('');
        setSelectedRoleId(allRoles[0]?.id || '');
        setIsEditing(true);
    };

    const handleDelete = (userId: string) => {
        // Prevent deleting self or admin if needed, but for now just simple confirm
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
        }
    };

    const handleSave = () => {
        if (!name || !username || !selectedRoleId) return;

        // For new users, password is required. For edit, it's optional (only if changing)
        if (!editingUser && !password) return;

        const newUser: User = {
            id: editingUser ? editingUser.id : `user-${Date.now()}`,
            name,
            username,
            // If editing and password is empty, keep old password. Else use new.
            password: (editingUser && !password) ? editingUser.password : password,
            roleId: selectedRoleId,
        };

        if (editingUser) {
            updateUser(newUser);
        } else {
            createUser(newUser);
        }

        setIsEditing(false);
    };

    const getRoleName = (roleId: string) => {
        const role = allRoles.find(r => r.id === roleId);
        return role ? role.name : 'Unknown Role';
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">User Management</h1>
                    <p className="text-muted-foreground">Manage system users and assign roles</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Create New User
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-[#1f1428] border border-primary/20 rounded-xl p-6 shadow-lg shadow-primary/5 animate-fade-in max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="e.g. john.doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Password {editingUser && '(Leave blank to keep current)'}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-80">Assign Role</label>
                            <select
                                value={selectedRoleId}
                                onChange={(e) => setSelectedRoleId(e.target.value)}
                                className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white"
                            >
                                <option value="" disabled>Select a role</option>
                                {allRoles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end border-t border-gray-800 pt-6">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            <Check className="w-4 h-4" />
                            Save User
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allUsers.map((user) => (
                        <div key={user.id} className="bg-[#1f1428] border border-gray-800/50 hover:border-primary/50 rounded-xl p-5 hover:shadow-lg hover:shadow-primary/10 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-0.5">
                                    <div className="w-full h-full rounded-full bg-[#1f1428] flex items-center justify-center">
                                        <UserIcon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user.name}</h3>
                                    <p className="text-sm text-gray-400">@{user.username}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700">
                                    <Shield className="w-3 h-3 text-accent" />
                                    <span className="text-xs font-medium text-gray-300">{getRoleName(user.roleId)}</span>
                                </div>
                                <span className="text-xs text-emerald-400 font-medium">Active</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
