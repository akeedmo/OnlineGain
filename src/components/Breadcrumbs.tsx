import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap py-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-indigo-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-400 truncate max-w-[200px] sm:max-w-none">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronLeft size={14} className="text-gray-300 shrink-0" />
          )}
        </div>
      ))}
    </nav>
  );
};
