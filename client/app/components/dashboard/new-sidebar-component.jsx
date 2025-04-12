import React from 'react';
import Link from 'next/link';

export default function NewSidebarComponent() {
  return (
    <div className="sidebar-item">
      <Link href="/dashboard/services/new-feature" className="sidebar-link">
        New Feature
      </Link>
    </div>
  );
}