import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
    stages: [
        { duration: '20s', target: 10 },
    ],
};

const BASE_URL = 'http://localhost:8080/api/products';

// Array con productos variados para crear
const productsToPost = [
    { name: 'Producto A', description: 'Descripción A', price: 10 },
    { name: 'Producto B', description: 'Descripción B', price: 20 },
    { name: 'Producto C', description: 'Descripción C', price: 30 },
    { name: 'Producto D', description: 'Descripción D', price: 40 },
];

export default function () {
    console.log('Iniciando la prueba...');
    // Elegir un producto aleatorio para POST
    const newProduct = productsToPost[Math.floor(Math.random() * productsToPost.length)];
    console.log(`Creando producto: ${newProduct.name}`); // Log para el producto creado

    // 1. Listar productos
    let listRes = http.get(BASE_URL);
    check(listRes, {
        'listar productos status 200': (r) => r.status === 200,
    });
    console.log('Productos listados con éxito');

    // 2. Crear un producto nuevo con datos aleatorios del array
    let createRes = http.post(BASE_URL, JSON.stringify(newProduct), {
        headers: { 'Content-Type': 'application/json' },
    });
    console.log('Respuesta de creación:', createRes.status); // Log de la respuesta
    check(createRes, {
        'crear producto status 201': (r) => r.status === 201,
    });

    const productId = createRes.json('id');
    console.log('ID del producto creado:', productId); // Log del ID

    if (productId) {
        // 3. Obtener producto por ID
        let getRes = http.get(`${BASE_URL}/${productId}`);
        check(getRes, {
            'obtener producto status 200': (r) => r.status === 200,
        });
        console.log('Producto obtenido con éxito');

        // 4. Actualizar producto
        const updateData = {
            name: `Producto k6 actualizado ${Math.floor(Math.random() * 1000)}`,
            description: 'Descripción actualizada por k6',
            price: Math.floor(Math.random() * 100) + 1,
        };
        let updateRes = http.put(`${BASE_URL}/${productId}`, JSON.stringify(updateData), {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Respuesta de actualización:', updateRes.status); // Log de la actualización
        check(updateRes, {
            'actualizar producto status 200': (r) => r.status === 200,
        });

        // 5. Eliminar producto
        let deleteRes = http.del(`${BASE_URL}/${productId}`);
        console.log('Respuesta de eliminación:', deleteRes.status); // Log de eliminación
        check(deleteRes, {
            'eliminar producto status 204 o 200': (r) => r.status === 204 || r.status === 200,
        });
    } else {
        console.error('No se obtuvo productId tras crear el producto.');
    }

    sleep(1); // Pausa entre iteraciones
}


// Generar reporte HTML automáticamente al final de la prueba
export function handleSummary(data) {
    console.log('Generando el reporte HTML...');
    return {
        'reports/reporte-k6.html': htmlReport(data), // Guarda el reporte en 'reports/reporte-k6.html'
    };
}
