import { ReactNode } from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string; 
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs,
  children 
}: PageHeaderProps) {
  return (
    <div className="space-y-4 pb-8 pt-6 md:pb-10 md:pt-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-muted-foreground mb-2">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/">
                <a className="hover:text-foreground transition-colors">Home</a>
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-1.5">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {crumb.href ? (
                  <Link href={crumb.href}>
                    <a className="hover:text-foreground transition-colors">{crumb.label}</a>
                  </Link>
                ) : (
                  <span className="font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-lg md:text-xl">{description}</p>
        )}
      </div>
      
      {children}
    </div>
  );
}