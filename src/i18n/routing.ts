// routing.ts
import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation';
import NextLink from 'next/link';
import { redirect as nextRedirect } from 'next/navigation';

export const useRouter = useNextRouter;
export const usePathname = useNextPathname;
export const Link = NextLink;
export const redirect = nextRedirect;

export const getPathname = (pathname: string) => pathname;