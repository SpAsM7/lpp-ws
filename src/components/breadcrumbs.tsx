'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

const formatSegment = (segment: string): string => {
  // Remove hyphens and capitalize words
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Remove leading slash and split into segments
  const segments = pathname.split('/').filter(Boolean);
  
  // If we're on the home page, only show "Home"
  if (segments.length === 0 || segments[0] === 'home') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const breadcrumbItems = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = formatSegment(segment);

    return (
      <BreadcrumbItem key={href}>
        {!isLast ? (
          <>
            <BreadcrumbLink asChild>
              <Link href={href}>{label}</Link>
            </BreadcrumbLink>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </>
        ) : (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
          {segments.length > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
