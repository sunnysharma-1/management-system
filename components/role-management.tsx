'use client';

import { useState } from 'react';
import { useAuth, Role } from './providers/auth-context';
import { navigationData, NavItem } from '@/lib/navigation';
import { Shield, Plus, Edit, Trash2, Check, X, ChevronRight, ChevronDown } from 'lucide-react';

export function RoleManagement() {
    const { allRoles, createRole, updateRole, deleteRole } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setRoleName(role.name);
        setSelectedPermissions(new Set(role.permissions));
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditingRole(null);
        setRoleName('');
        setSelectedPermissions(new Set());
        setIsEditing(true);
    };

    const handleDelete = (roleId: string) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            deleteRole(roleId);
        }
    };

    const handleSave = () => {
        if (!roleName) return;

        // Fix: Convert Set to Array properly
        const permissionsArray = [];
        // Manually iterate or use Array.from if available in environment (it is in browser)
        // Using a simpler loop to be safe if TS version is old, but Array.from(selectedPermissions) is standard.
        const iterator = selectedPermissions.values();
        let result = iterator.next();
        while (!result.done) {
            permissionsArray.push(result.value);
            result = iterator.next();
        }

        // If "ALL" was selected (special handling if we had a master toggle, but for now we pick specific items)

        const newRole: Role = {
            id: editingRole ? editingRole.id : `role-${Date.now()}`,
            name: roleName,
            permissions: permissionsArray,
            isSystem: false, // User created roles are never system roles
        };

        if (editingRole) {
            updateRole(newRole);
        } else {
            createRole(newRole);
        }

        setIsEditing(false);
    };

    const togglePermission = (id: string) => {
        const newPermissions = new Set(selectedPermissions);

        // Helper to recursively toggle children
        const toggleChildren = (items: NavItem[], shouldAdd: boolean) => {
            items.forEach(item => {
                if (shouldAdd) newPermissions.add(item.id);
                else newPermissions.delete(item.id);
                if (item.children) toggleChildren(item.children, shouldAdd);
            });
        }

        // Find the item in navigationData to check for children
        const findItem = (items: NavItem[]): NavItem | undefined => {
            for (const item of items) {
                if (item.id === id) return item;
                if (item.children) {
                    const found = findItem(item.children);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const item = findItem(navigationData);

        if (newPermissions.has(id)) {
            newPermissions.delete(id);
            // If we uncheck a parent, uncheck all children? Ideally yes for consistency
            if (item && item.children) {
                toggleChildren(item.children, false);
            }
        } else {
            newPermissions.add(id);
            // If we check a parent, check all children? Or let user pick? 
            // Let's auto-select children for convenience
            if (item && item.children) {
                toggleChildren(item.children, true);
            }
        }
        setSelectedPermissions(newPermissions);
    };

    // Recursively render permission checkboxes
    const renderPermissionNode = (item: NavItem, level: number = 0) => {
        const isChecked = selectedPermissions.has(item.id);
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.id} className="ml-4">
                <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-primary/5 rounded px-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(item.id)}
                        className="rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                    />
                    <span className={level === 0 ? "font-semibold" : ""}>{item.label}</span>
                </label>
                {hasChildren && (
                    <div className="border-l border-gray-700 ml-2 pl-2">
                        {item.children!.map(child => renderPermissionNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Role Management</h1>
                    <p className="text-muted-foreground">Manage user roles and access permissions</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Role
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-[#1f1428] border border-primary/20 rounded-xl p-6 shadow-lg shadow-primary/5 animate-fade-in">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 opacity-80">Role Name</label>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="w-full bg-[#130d1f] border border-gray-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. HR Manager"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-4 opacity-80">Permissions</label>
                        <div className="bg-[#130d1f] border border-gray-700 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                            {navigationData.map(item => renderPermissionNode(item))}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
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
                            Save Role
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allRoles.map((role) => (
                        <div key={role.id} className="bg-[#1f1428] border border-gray-800/50 hover:border-primary/50 rounded-xl p-5 hover:shadow-lg hover:shadow-primary/10 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => handleEdit(role)}
                                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                {!role.isSystem && (
                                    <button
                                        onClick={() => handleDelete(role.id)}
                                        className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700">
                                    <Shield className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{role.name}</h3>
                                    <div className="flex gap-2 text-xs">
                                        {role.isSystem && (
                                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full">System</span>
                                        )}
                                        <span className="bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded-full">{role.permissions.length} Permissions</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Access Highlights</p>
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.slice(0, 5).map(p => (
                                        <span key={p} className="text-xs bg-gray-900 border border-gray-700 px-2 py-1 rounded text-gray-300">
                                            {p}
                                        </span>
                                    ))}
                                    {role.permissions.length > 5 && (
                                        <span className="text-xs text-gray-500 pl-1">+{role.permissions.length - 5} more</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
