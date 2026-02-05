'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-context';
import type { NavItem } from '@/lib/navigation';

interface SidebarProps {
  items: NavItem[];
  onItemClick: (itemId: string) => void;
  activeItem: string;
}

export function Sidebar({ items, onItemClick, activeItem }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['dashboard']));
  const { role } = useAuth();

  // Helper function to check if an item or its children are allowed
  const isItemAllowed = (item: NavItem): boolean => {
    if (!role) return false;
    if (role.permissions.includes('ALL')) return true;

    // Check if the item itself is allowed
    const isAllowed = role.permissions.includes(item.id);

    // If it has children, check if ANY child is allowed (so we show the parent)
    if (item.children && item.children.length > 0) {
      const hasAllowedChild = item.children.some(child => isItemAllowed(child));
      return isAllowed || hasAllowedChild;
    }

    return isAllowed;
  };

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    if (!isItemAllowed(item)) return null;

    const isExpanded = expandedItems.has(item.id);
    // Filter children for rendering
    const visibleChildren = item.children?.filter(child => isItemAllowed(child));
    const hasChildren = visibleChildren && visibleChildren.length > 0;
    const isActive = activeItem === item.id;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onItemClick(item.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 transform ${level === 0
            ? 'text-sm font-semibold'
            : 'text-sm ml-2'
            } ${isActive
              ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/50 shadow-lg shadow-primary/20 animate-neon-border'
              : 'text-sidebar-foreground hover:bg-primary/10 hover:border hover:border-primary/30 hover:translate-x-1'
            } ${hasChildren && level === 0
              ? 'group'
              : ''
            } rounded-lg mx-1 backdrop-blur-sm`}
        >
          <span className="text-base">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {hasChildren && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                }`}
            />
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="animate-slide-down pl-0">
            {visibleChildren.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 bg-gradient-to-b from-sidebar-background to-[#1a0f35] text-sidebar-foreground min-h-screen flex flex-col border-r border-sidebar-border/50 backdrop-blur-md">
      {/* Header */}
      <div className="px-6 py-8 border-b border-sidebar-border/30 bg-gradient-to-b from-sidebar-background/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg animate-neon-border">
            A
          </div>
          <div>
            <h1 className="font-bold text-xl text-primary animate-neon-glow">AXIS</h1>
            <p className="text-xs text-accent/80">HRM System</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-1 custom-scrollbar">
        {items.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border/30 px-6 py-4 text-xs text-sidebar-foreground/60 bg-gradient-to-t from-sidebar-background/50 to-transparent">
        <p className="text-accent/60 font-semibold">© 2024 AXIS</p>
        <p>Enterprise Resource Planning</p>
      </div>
    </div>
  );
}
