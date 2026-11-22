import type { PracticeSet } from './types';

// Practice and assessment for the "árboles binarios" presentation
// (lesson `arboles-binarios`).
const BASE = `#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *izquierdo;
    struct Nodo *derecho;
} Nodo;

Nodo *crear_nodo(int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return NULL;
    }
    nodo->dato = dato;
    nodo->izquierdo = NULL;
    nodo->derecho = NULL;
    return nodo;
}

bool insertar(Nodo **raiz, int dato) {
    if (*raiz == NULL) {
        *raiz = crear_nodo(dato);
        return *raiz != NULL;
    }
    if (dato < (*raiz)->dato) {
        return insertar(&(*raiz)->izquierdo, dato);
    }
    if (dato > (*raiz)->dato) {
        return insertar(&(*raiz)->derecho, dato);
    }
    return true;
}
`;

const DESTRUIR = `
void destruir_arbol(Nodo *raiz) {
    if (raiz == NULL) {
        return;
    }
    destruir_arbol(raiz->izquierdo);
    destruir_arbol(raiz->derecho);
    free(raiz);
}
`;

const PREORDEN = `
void preorden(const Nodo *raiz) {
    if (raiz != NULL) {
        printf("%d ", raiz->dato);
        preorden(raiz->izquierdo);
        preorden(raiz->derecho);
    }
}
`;

const INORDEN = `
void inorden(const Nodo *raiz) {
    if (raiz != NULL) {
        inorden(raiz->izquierdo);
        printf("%d ", raiz->dato);
        inorden(raiz->derecho);
    }
}
`;

const POSTORDEN = `
void postorden(const Nodo *raiz) {
    if (raiz != NULL) {
        postorden(raiz->izquierdo);
        postorden(raiz->derecho);
        printf("%d ", raiz->dato);
    }
}
`;

const ALTURA = `
size_t altura(const Nodo *raiz) {
    if (raiz == NULL) {
        return 0;
    }
    size_t izquierda = altura(raiz->izquierdo);
    size_t derecha = altura(raiz->derecho);
    return 1 + (izquierda > derecha ? izquierda : derecha);
}
`;

const P1 = `${BASE}${PREORDEN}${DESTRUIR}
int main(void) {
    Nodo *raiz = NULL;
    insertar(&raiz, 50);
    insertar(&raiz, 30);
    insertar(&raiz, 70);
    insertar(&raiz, 40);
    preorden(raiz);
    printf("\\n");
    destruir_arbol(raiz);
    return 0;
}`;

const P3 = `${BASE}${INORDEN}${DESTRUIR}
int main(void) {
    Nodo *raiz = NULL;
    int valores[] = {8, 3, 10, 1, 6};
    for (size_t i = 0; i < 5; i++) {
        insertar(&raiz, valores[i]);
    }
    inorden(raiz);
    printf("\\n");
    destruir_arbol(raiz);
    return 0;
}`;

const P4 = `${BASE}${POSTORDEN}${DESTRUIR}
int main(void) {
    Nodo *raiz = NULL;
    int valores[] = {4, 2, 6, 1, 3};
    for (size_t i = 0; i < 5; i++) {
        insertar(&raiz, valores[i]);
    }
    postorden(raiz);
    printf("\\n");
    destruir_arbol(raiz);
    return 0;
}`;

const P5 = `${BASE}${ALTURA}${DESTRUIR}
int main(void) {
    Nodo *raiz = NULL;
    for (int valor = 1; valor <= 4; valor++) {
        insertar(&raiz, valor);
    }
    printf("%zu\\n", altura(raiz));
    destruir_arbol(raiz);
    return 0;
}`;

const P6 = `${BASE}${INORDEN}${DESTRUIR}
int main(void) {
    Nodo *raiz = NULL;
    insertar(&raiz, 5);
    insertar(&raiz, 3);
    insertar(&raiz, 5);
    insertar(&raiz, 3);
    inorden(raiz);
    printf("\\n");
    destruir_arbol(raiz);
    return 0;
}`;

const A1 = `${BASE}${PREORDEN}${DESTRUIR}
int main(void) {
    Nodo *raiz = NULL;
    int valores[] = {40, 20, 60, 10, 30};
    for (size_t i = 0; i < 5; i++) {
        insertar(&raiz, valores[i]);
    }
    preorden(raiz);
    printf("\\n");
    destruir_arbol(raiz);
    return 0;
}`;

const A2 = `${BASE}
void destruir_arbol(Nodo *raiz) {
    if (raiz == NULL) {
        return;
    }
    destruir_arbol(raiz->izquierdo);
    destruir_arbol(raiz->derecho);
    printf("libero %d\\n", raiz->dato);
    free(raiz);
}

int main(void) {
    Nodo *raiz = NULL;
    insertar(&raiz, 2);
    insertar(&raiz, 1);
    insertar(&raiz, 3);
    destruir_arbol(raiz);
    return 0;
}`;

const A3 = `${BASE}${ALTURA}${DESTRUIR}
int main(void) {
    Nodo *raiz = NULL;
    for (int valor = 5; valor >= 1; valor--) {
        insertar(&raiz, valor);
    }
    printf("altura = %zu\\n", altura(raiz));
    destruir_arbol(raiz);
    return 0;
}`;

const A4 = `#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *izquierdo;
    struct Nodo *derecho;
} Nodo;

Nodo *crear_nodo(int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return NULL;
    }
    nodo->dato = dato;
    nodo->izquierdo = NULL;
    nodo->derecho = NULL;
    return nodo;
}

void insertar(Nodo *raiz, int dato) {
    if (raiz == NULL) {
        raiz = crear_nodo(dato);
        return;
    }
    if (dato < raiz->dato) {
        insertar(raiz->izquierdo, dato);
    } else if (dato > raiz->dato) {
        insertar(raiz->derecho, dato);
    }
}

int main(void) {
    Nodo *raiz = NULL;
    insertar(raiz, 10);
    insertar(raiz, 5);
    printf("raiz es NULL: %d\\n", raiz == NULL);
    return 0;
}`;

const A5 = `${BASE}${DESTRUIR}
const Nodo *buscar(const Nodo *raiz, int dato) {
    if (raiz == NULL || raiz->dato == dato) {
        return raiz;
    }
    if (dato < raiz->dato) {
        return buscar(raiz->derecho, dato);
    }
    return buscar(raiz->izquierdo, dato);
}

int main(void) {
    Nodo *raiz = NULL;
    insertar(&raiz, 50);
    insertar(&raiz, 30);
    insertar(&raiz, 70);
    printf("%s\\n", buscar(raiz, 30) != NULL ? "encontrado" : "no encontrado");
    destruir_arbol(raiz);
    return 0;
}`;

const A6 = `/* c-check: skip */
void destruir_arbol(Nodo *raiz) {
    if (raiz == NULL) {
        return;
    }
    free(raiz);
    destruir_arbol(raiz->izquierdo);
    destruir_arbol(raiz->derecho);
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: {
				es: 'El árbol se construye insertando 50, 30, 70 y 40. ¿Qué imprime el recorrido en preorden?',
				en: 'The tree is built by inserting 50, 30, 70 and 40. What does the preorder traversal print?',
			},
			code: P1,
			options: [
				{ id: 'a', text: { es: '`50 30 40 70`', en: '`50 30 40 70`' } },
				{ id: 'b', text: { es: '`30 40 50 70`', en: '`30 40 50 70`' } },
				{ id: 'c', text: { es: '`50 30 70 40`', en: '`50 30 70 40`' } },
			],
			correct: 'a',
			explanation: {
				es: '40 es menor que 50 (va a la izquierda) y mayor que 30 (queda como su hijo derecho). El preorden visita el nodo, luego el subárbol izquierdo y luego el derecho: 50, 30, 40, 70.',
				en: '40 is smaller than 50 (goes left) and larger than 30 (becomes its right child). Preorder visits the node, then the left subtree, then the right one: 50, 30, 40, 70.',
			},
		},
		{
			id: 'p2',
			prompt: {
				es: 'En un árbol con raíz 50, hijo izquierdo 30 e hijo derecho 70, insertas 35. ¿Dónde queda?',
				en: 'In a tree with root 50, left child 30 and right child 70, you insert 35. Where does it end up?',
			},
			options: [
				{ id: 'a', text: { es: 'Hijo izquierdo de 30', en: 'Left child of 30' } },
				{ id: 'b', text: { es: 'Hijo derecho de 30', en: 'Right child of 30' } },
				{ id: 'c', text: { es: 'Hijo izquierdo de 70', en: 'Left child of 70' } },
			],
			correct: 'b',
			explanation: {
				es: '35 < 50, así que baja por la izquierda hasta el 30. Como 35 > 30 y el hijo derecho de 30 está vacío (`NULL`), el nodo nuevo se cuelga ahí.',
				en: '35 < 50, so it goes down the left side to 30. Since 35 > 30 and the right child of 30 is empty (`NULL`), the new node is attached there.',
			},
		},
		{
			id: 'p3',
			prompt: {
				es: 'Se insertan 8, 3, 10, 1 y 6. ¿Qué imprime el recorrido en inorden?',
				en: 'The values 8, 3, 10, 1 and 6 are inserted. What does the inorder traversal print?',
			},
			code: P3,
			options: [
				{ id: 'a', text: { es: '`8 3 1 6 10`', en: '`8 3 1 6 10`' } },
				{ id: 'b', text: { es: '`1 3 6 8 10`', en: '`1 3 6 8 10`' } },
				{ id: 'c', text: { es: '`1 6 3 10 8`', en: '`1 6 3 10 8`' } },
			],
			correct: 'b',
			explanation: {
				es: 'El inorden visita primero todos los menores, después el nodo y después todos los mayores. En un árbol de búsqueda eso produce los valores ordenados.',
				en: 'Inorder visits all the smaller values first, then the node, then all the larger ones. In a search tree that yields the values in sorted order.',
			},
		},
		{
			id: 'p4',
			prompt: {
				es: 'Se insertan 4, 2, 6, 1 y 3. ¿Qué imprime el recorrido en postorden?',
				en: 'The values 4, 2, 6, 1 and 3 are inserted. What does the postorder traversal print?',
			},
			code: P4,
			options: [
				{ id: 'a', text: { es: '`1 3 2 6 4`', en: '`1 3 2 6 4`' } },
				{ id: 'b', text: { es: '`4 2 1 3 6`', en: '`4 2 1 3 6`' } },
				{ id: 'c', text: { es: '`1 2 3 4 6`', en: '`1 2 3 4 6`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El postorden visita el subárbol izquierdo, el derecho y al final el nodo. Por eso la raíz 4 sale última, y el 2 sale después de sus hijos 1 y 3.',
				en: 'Postorder visits the left subtree, the right one and the node last. That is why the root 4 comes out last, and 2 comes after its children 1 and 3.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'Se insertan 1, 2, 3 y 4 en ese orden. ¿Qué imprime `altura(raiz)`?',
				en: 'The values 1, 2, 3 and 4 are inserted in that order. What does `altura(raiz)` print?',
			},
			code: P5,
			options: [
				{ id: 'a', text: { es: '`2`', en: '`2`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: '`4`', en: '`4`' } },
			],
			correct: 'c',
			explanation: {
				es: 'Cada valor es mayor que todos los anteriores, así que siempre baja por la derecha: el árbol es una cadena de 4 nodos, con altura 4. Es un árbol degenerado.',
				en: 'Each value is larger than all the previous ones, so it always goes right: the tree is a chain of 4 nodes, with height 4. It is a degenerate tree.',
			},
		},
		{
			id: 'p6',
			prompt: {
				es: 'Se insertan 5, 3, 5 y 3. ¿Qué imprime el inorden?',
				en: 'The values 5, 3, 5 and 3 are inserted. What does the inorder traversal print?',
			},
			code: P6,
			options: [
				{ id: 'a', text: { es: '`3 5`', en: '`3 5`' } },
				{ id: 'b', text: { es: '`3 3 5 5`', en: '`3 3 5 5`' } },
				{ id: 'c', text: { es: '`5 3`', en: '`5 3`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Cuando `insertar` encuentra un valor igual, no hace nada y devuelve `true`: el árbol no guarda repetidos, así que quedan solo el 3 y el 5, en orden.',
				en: 'When `insertar` finds an equal value it does nothing and returns `true`: the tree stores no duplicates, so only 3 and 5 remain, in order.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: {
				es: 'Se insertan 40, 20, 60, 10 y 30. ¿Qué imprime el preorden?',
				en: 'The values 40, 20, 60, 10 and 30 are inserted. What does preorder print?',
			},
			code: A1,
			options: [
				{ id: 'a', text: { es: '`40 20 10 30 60`', en: '`40 20 10 30 60`' } },
				{ id: 'b', text: { es: '`10 20 30 40 60`', en: '`10 20 30 40 60`' } },
				{ id: 'c', text: { es: '`40 20 60 10 30`', en: '`40 20 60 10 30`' } },
				{ id: 'd', text: { es: '`10 30 20 60 40`', en: '`10 30 20 60 40`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El árbol tiene raíz 40, con 20 (hijos 10 y 30) a la izquierda y 60 a la derecha. El preorden visita 40, todo el subárbol izquierdo (20, 10, 30) y por último 60. El orden de inserción no es el de recorrido.',
				en: 'The tree has root 40, with 20 (children 10 and 30) on the left and 60 on the right. Preorder visits 40, the whole left subtree (20, 10, 30) and finally 60. Insertion order is not traversal order.',
			},
		},
		{
			id: 'a2',
			prompt: {
				es: 'Se insertan 2, 1 y 3. ¿En qué orden imprime `libero` este programa?',
				en: 'The values 2, 1 and 3 are inserted. In what order does this program print `libero`?',
			},
			code: A2,
			options: [
				{ id: 'a', text: { es: '2, 1, 3', en: '2, 1, 3' } },
				{ id: 'b', text: { es: '1, 3, 2', en: '1, 3, 2' } },
				{ id: 'c', text: { es: '3, 1, 2', en: '3, 1, 2' } },
				{ id: 'd', text: { es: '1, 2, 3', en: '1, 2, 3' } },
			],
			correct: 'b',
			explanation: {
				es: 'La función libera en postorden: primero el subárbol izquierdo (1), luego el derecho (3) y al final el nodo (2). La raíz es siempre el último nodo en liberarse.',
				en: 'The function frees in postorder: first the left subtree (1), then the right one (3) and the node (2) last. The root is always the last node freed.',
			},
		},
		{
			id: 'a3',
			prompt: {
				es: 'Se insertan 5, 4, 3, 2 y 1 en ese orden. ¿Qué imprime este programa?',
				en: 'The values 5, 4, 3, 2 and 1 are inserted in that order. What does this program print?',
			},
			code: A3,
			options: [
				{ id: 'a', text: { es: '`altura = 3`', en: '`altura = 3`' } },
				{ id: 'b', text: { es: '`altura = 5`', en: '`altura = 5`' } },
				{ id: 'c', text: { es: '`altura = 1`', en: '`altura = 1`' } },
				{ id: 'd', text: { es: '`altura = 4`', en: '`altura = 4`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Cada valor es menor que el anterior, así que cuelga siempre a la izquierda y el árbol degenera en una cadena de 5 nodos. Buscar en él cuesta O(n), no O(log n).',
				en: 'Each value is smaller than the previous one, so it always hangs on the left and the tree degenerates into a chain of 5 nodes. Searching it costs O(n), not O(log n).',
			},
		},
		{
			id: 'a4',
			prompt: {
				es: 'Este programa debería construir un árbol, pero imprime `raiz es NULL: 1`. ¿Cuál es el error?',
				en: 'This program should build a tree, but it prints `raiz es NULL: 1`. What is the bug?',
			},
			code: A4,
			options: [
				{
					id: 'a',
					text: {
						es: '`insertar` recibe `Nodo *`: modifica una copia y el `main` no ve el nodo (y se pierde, una fuga)',
						en: '`insertar` takes `Nodo *`: it changes a copy and `main` never sees the node (which leaks)',
					},
				},
				{ id: 'b', text: { es: '`crear_nodo` debería usar `calloc`', en: '`crear_nodo` should use `calloc`' } },
				{ id: 'c', text: { es: 'Falta un `return` en `main`', en: '`main` is missing a `return`' } },
				{ id: 'd', text: { es: 'La comparación `dato < raiz->dato` está al revés', en: 'The `dato < raiz->dato` comparison is backwards' } },
			],
			correct: 'a',
			explanation: {
				es: 'El puntero se pasa por valor, así que `raiz = crear_nodo(dato)` cambia solo la copia local. Hace falta `Nodo **raiz` para escribir en el puntero del llamador; además el nodo creado queda sin dueño y se filtra.',
				en: 'The pointer is passed by value, so `raiz = crear_nodo(dato)` changes only the local copy. You need `Nodo **raiz` to write into the caller\'s pointer; the created node is also left without an owner and leaks.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: 'El árbol tiene 50, 30 y 70, y `buscar` se escribió con las ramas cruzadas. ¿Qué imprime este programa?',
				en: 'The tree holds 50, 30 and 70, and `buscar` was written with the branches crossed. What does this program print?',
			},
			code: A5,
			options: [
				{ id: 'a', text: { es: '`encontrado`', en: '`encontrado`' } },
				{ id: 'b', text: { es: '`no encontrado`', en: '`no encontrado`' } },
				{ id: 'c', text: { es: 'Falla en tiempo de ejecución', en: 'It fails at run time' } },
			],
			correct: 'b',
			explanation: {
				es: '30 < 50, pero el código baja por el derecho (hacia el 70) y de ahí hacia la izquierda, que está vacía: devuelve `NULL`. El valor está en el árbol, pero la búsqueda mira el lado equivocado.',
				en: '30 < 50, but the code goes right (towards 70) and from there left, which is empty: it returns `NULL`. The value is in the tree, but the search looks at the wrong side.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: '¿Qué problema tiene esta función al liberar el árbol?',
				en: 'What is wrong with this function when freeing the tree?',
			},
			code: A6,
			options: [
				{
					id: 'a',
					text: {
						es: 'Lee `raiz->izquierdo` después de `free(raiz)`: uso después de liberar',
						en: 'It reads `raiz->izquierdo` after `free(raiz)`: use after free',
					},
				},
				{ id: 'b', text: { es: 'No libera la raíz', en: 'It does not free the root' } },
				{ id: 'c', text: { es: 'Libera cada nodo dos veces', en: 'It frees every node twice' } },
				{ id: 'd', text: { es: 'No tiene ningún problema', en: 'It has no problem' } },
			],
			correct: 'a',
			explanation: {
				es: 'Liberar primero el nodo deja inválidos sus punteros: al pasarlos a las llamadas recursivas se leen datos ya liberados. El orden correcto es postorden: hijos primero y el nodo al final.',
				en: 'Freeing the node first invalidates its pointers: passing them to the recursive calls reads already freed data. The right order is postorder: children first and the node last.',
			},
		},
	],
};
