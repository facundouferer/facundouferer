const ABSOLUTE_PROTOCOL = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

export const withBase = (path: string): string => {
	if (ABSOLUTE_PROTOCOL.test(path) || path.startsWith('#')) {
		return path;
	}

	const rawBase = import.meta.env.BASE_URL;
	const base = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

	if (path === '/') {
		return `${base}/`;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	if (base && normalizedPath.startsWith(`${base}/`)) {
		return normalizedPath;
	}

	return `${base}${normalizedPath}`;
};
