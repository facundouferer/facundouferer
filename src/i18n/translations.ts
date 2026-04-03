export type Locale = 'es' | 'en';

type Translation = {
	nav: {
		projects: string;
		articles: string;
		about: string;
		contact: string;
		hire: string;
	};
	home: {
		title: string;
		description: string;
	};
};

export const translations: Record<Locale, Translation> = {
	es: {
		nav: {
			projects: 'Proyectos',
			articles: 'Articulos',
			about: 'Sobre mi',
			contact: 'Contacto',
			hire: 'Contratame',
		},
		home: {
			title: 'Facundo Uferer — Ingeniero Full Stack con IA',
			description:
				'Ingeniero Full Stack Senior especializado en desarrollo asistido por IA. De la idea al deploy, mas rapido que cualquier equipo tradicional.',
		},
	},
	en: {
		nav: {
			projects: 'Projects',
			articles: 'Articles',
			about: 'About',
			contact: 'Contact',
			hire: 'Hire Me',
		},
		home: {
			title: 'Facundo Uferer — AI-Driven Full Stack Engineer',
			description:
				'Senior Full Stack Engineer specializing in AI-assisted development. From idea to production, faster than any traditional team.',
		},
	},
};
