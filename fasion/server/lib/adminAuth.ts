import { NextRequest } from 'next/server';

export function getAllowedAdminEmails(): string[] {
  const envVal = process.env.ADMIN_ALLOWED_EMAILS || 'admin@genrecompass.com,jiwankim0811@gmail.com';
  return envVal
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowed = getAllowedAdminEmails();
  return allowed.includes(email.trim().toLowerCase());
}

export function getAdminEmailFromRequest(req: NextRequest): string | null {
  const cookieEmail = req.cookies.get('genre_admin_email')?.value;
  if (cookieEmail) return decodeURIComponent(cookieEmail);

  const headerEmail = req.headers.get('x-admin-email');
  if (headerEmail) return headerEmail;

  return null;
}
