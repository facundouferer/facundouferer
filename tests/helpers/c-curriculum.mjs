// Shared by the C course tests (odd/tasks/c-course-redesign.md).
// DONE_STAGE: the last finished stage of the redesign; lessons of later
// stages are not enforced yet.

// C_DONE_STAGE lets a writer check a stage before it is marked done.
export const DONE_STAGE = Number(process.env.C_DONE_STAGE ?? 4);
// Activities (quizzes and projects) are enforced by the stage that delivers them.
export const ACTIVITIES_DONE_STAGE = Number(process.env.C_ACTIVITIES_DONE_STAGE ?? 4);

// [slug, stage that rewrites or creates it]
const ORDER = [
	// 1. Introducción, compilación y fundamentos
	['introduccion-y-estructura', 3],
	['procesos-y-estados', 3],
	['compilacion-y-enlazado', 1],
	['variables-y-constantes', 1],
	['tipos-de-datos', 1],
	['entrada-y-salida', 1],
	['operadores', 1],
	// 2. Control de flujo
	['sentencia-if-else', 2],
	['operador-ternario', 2],
	['sentencia-switch-y-bloques-de-codigo', 2],
	['sentencia-while', 2],
	['sentencia-for', 2],
	['sentencia-do-while', 2],
	['programacion-esquematica-y-sentencias-anidadas', 2],
	// 3. Funciones y programación modular
	['modularizacion-subprogramas-y-funciones', 1],
	['variables-parametros-y-pasaje', 1],
	['recursividad', 1],
	// 4. Tipos derivados y datos estáticos
	['manejo-de-estructuras-secuenciales-de-datos', 2],
	['arreglos-unidimensionales-y-multidimensionales', 2],
	['operaciones-con-arreglos', 2],
	['cadenas-de-caracteres-y-operaciones', 2],
	['concepto-de-estructuras', 2],
	['busqueda-en-arreglos', 2],
	['ordenacion-de-arreglos', 2],
	// 5. Punteros y modelo de memoria
	['punteros-y-direcciones', 1],
	['punteros-arreglos-y-estructuras', 1],
	['duracion-y-ciclo-de-vida', 1],
	// 6. Memoria dinámica
	['memoria-dinamica', 1],
	['propiedad-y-errores-de-memoria', 1],
	// 7. Estructuras de datos dinámicas
	['estructuras-dinamicas-listas', 2],
	['estructuras-dinamicas-pilas', 2],
	['estructuras-dinamicas-colas', 2],
	['arboles-binarios', 2],
	// 8. Biblioteca estándar, E/S y persistencia
	['biblioteca-estandar-y-errores', 2],
	['archivos', 2],
	// 9. Calidad, depuración y buenas prácticas
	['depuracion-y-sanitizers', 3],
	['pruebas-estilo-y-portabilidad', 3],
	// 10. C moderno y C23 (avanzado)
	['c23-moderno', 4],
	['preprocesador-y-programacion-generica', 4],
	['concurrencia-threads-y-atomics', 4],
	// 11. Complementario: diseño de software en C (avanzado)
	['introduccion-a-poo-en-c', 2],
	['encapsulacion-y-abstraccion-en-c', 2],
	['objetos-metodos-y-diseno-basado-en-struct', 2],
	['polimorfismo-y-herencia-simulados-en-c', 2],
];

export const LESSONS = ORDER.map(([slug, stage], index) => ({
	slug,
	stage,
	order: index + 1,
	file: `${String(index + 1).padStart(2, '0')}-${slug}`,
}));


// Topics a lesson must not use yet, keyed by the lesson that teaches them.
// Each entry is [regex, description].
export const TAUGHT_AT = [
	['arreglos-unidimensionales-y-multidimensionales', /\b(?:int|char|double|float|long|short|unsigned|bool)\s+[A-Za-z_]\w*\s*\[[^\]]*\]\s*(?:=|;|\[)/, 'array declarations'],
	['concepto-de-estructuras', /\bstruct\s+[A-Za-z_]\w*\s*\{/, 'struct definitions'],
	['punteros-y-direcciones', /(?<!\*\*)\b(?:int|char|double|float|long|short|unsigned|void|bool)\s*\*+\s*[A-Za-z_]/, 'pointer declarations'],
	['punteros-arreglos-y-estructuras', /->/, 'the -> operator'],
	['memoria-dinamica', /\b(?:malloc|calloc|realloc|free)\s*\(/, 'dynamic memory calls'],
];


// Stage that delivers each lesson's quiz and project (odd/tasks/c-course-redesign.md T9, T17, T22, T27).
export function activityStage(lesson) {
	if (lesson.order <= 17 || (lesson.order >= 25 && lesson.order <= 29)) return 1;
	if (lesson.order >= 36 && lesson.order <= 37) return 3;
	if (lesson.order >= 38 && lesson.order <= 40) return 4;
	return 2;
}

export const orderOf = Object.fromEntries(LESSONS.map((lesson) => [lesson.slug, lesson.order]));
