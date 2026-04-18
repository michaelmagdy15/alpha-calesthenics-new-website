import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-on-surface-variant">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {isLast || !item.path ? (
                <span className="font-semibold text-on-surface" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                  <span className="material-symbols-outlined text-sm mx-2 opacity-50">
                    chevron_right
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
