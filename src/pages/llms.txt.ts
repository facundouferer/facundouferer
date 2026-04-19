import { buildLlmsDocument } from '../seo/schema';

export function GET() {
	return new Response(buildLlmsDocument(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
