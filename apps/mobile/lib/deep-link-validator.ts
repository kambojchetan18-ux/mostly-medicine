const APP_SCHEME = 'mostlymedicine';

const ALLOWED_PATHS: string[] = [
  '/',
  '/(tabs)',
  '/(tabs)/cat1',
  '/(tabs)/cat1/quiz',
  '/(tabs)/cat2',
  '/(tabs)/flashcards',
  '/(tabs)/flashcards/:slug',
  '/(tabs)/roleplay',
  '/(tabs)/progress',
  '/(tabs)/library',
  '/(tabs)/jobs',
  '/(tabs)/jobs/rmo',
  '/(tabs)/jobs/gp',
  '/(tabs)/jobs/specialist',
  '/(tabs)/jobs/action-plan',
  '/auth/login',
  '/auth/signup',
];

function patternToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')   // escape regex meta-chars
    .replace(/\\:([a-zA-Z]+)/g, '[a-zA-Z0-9_-]+'); // dynamic segment
  return new RegExp(`^${escaped}/?$`);
}

const ALLOWED_REGEXES = ALLOWED_PATHS.map(patternToRegex);

function sanitisePath(raw: string): string {
  const collapsed = raw.replace(/\/+/g, '/');
  const segments = collapsed.split('/').filter((s) => s !== '.' && s !== '..');
  const cleaned = '/' + segments.filter(Boolean).join('/');
  return cleaned === '' ? '/' : cleaned;
}

export function isDeepLinkAllowed(url: string): boolean {
  try {
    // Handle scheme-relative URLs that URL() can't parse directly.
    let parsed: URL;
    if (url.startsWith(`${APP_SCHEME}://`)) {
      // Swap scheme so URL() can parse it.
      parsed = new URL(url.replace(`${APP_SCHEME}://`, 'https://placeholder/'));
    } else if (url.startsWith('https://') || url.startsWith('http://')) {
      parsed = new URL(url);
    } else if (url.startsWith('/')) {
      // Path-only form (expo-router internal navigation)
      parsed = new URL(url, 'https://placeholder');
    } else {
      // Unknown scheme — reject.
      return false;
    }

    // Validate the path against known routes.
    const path = sanitisePath(parsed.pathname);
    const pathAllowed = ALLOWED_REGEXES.some((re) => re.test(path));
    if (!pathAllowed) {
      return false;
    }

    // Reject query/fragment values with obvious injection patterns.
    // This catches `javascript:`, `data:`, embedded `<script>`, etc.
    const dangerousPattern = /javascript:|data:|<script|%3Cscript|<\/script|%3C\/script/i;
    if (dangerousPattern.test(parsed.search) || dangerousPattern.test(parsed.hash)) {
      return false;
    }

    return true;
  } catch {
    // Malformed URL — reject.
    return false;
  }
}
