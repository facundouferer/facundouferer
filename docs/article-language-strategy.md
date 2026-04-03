# Article Language Strategy

- Base language: Spanish first (`lang: es`), then English translation when available.
- Dual publication: use `lang: both`.
- English route fallback: if article is Spanish-only, show notice in `/en/articles/[slug]`.
- Spanish route fallback: if article is English-only, show notice in `/articulos/[slug]`.
- SEO note: always keep route available and expose alternate `hreflang` from layout.
