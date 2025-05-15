import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
    stages: [
        { duration: '20s', target: 10 },    // Subida suave a 10 usuarios
        { duration: '1m', target: 50 },     // Subida rápida a 50 usuarios
        { duration: '3m', target: 50 },     // Mantener carga estable alta
        { duration: '1m30s', target: 20 },  // Descenso a 20 usuarios
        { duration: '30s', target: 0 },     // Finaliza prueba bajando a 0
    ],
};

const BASE_URL = 'http://localhost:8080/api/products';

// Array con productos variados para crear
const productsToPost = [
    { name: 'Producto A', description: 'Descripción A', price: 10 },
    { name: 'Producto B', description: 'Descripción B', price: 20 },
    { name: 'Producto C', description: 'Descripción C', price: 30 },
    { name: 'Producto D', description: 'Descripción D', price: 40 },
    // Puedes agregar más objetos aquí
];

export default function () {
    // Elegir un producto aleatorio para POST
    const newProduct = productsToPost[Math.floor(Math.random() * productsToPost.length)];

    // 1. Listar productos
    let listRes = http.get(BASE_URL);
    check(listRes, {
        'listar productos status 200': (r) => r.status === 200,
    });

    // 2. Crear un producto nuevo con datos aleatorios del array
    let createRes = http.post(BASE_URL, JSON.stringify(newProduct), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(createRes, {
        'crear producto status 201': (r) => r.status === 201,
    });

    const productId = createRes.json('id');

    if (productId) {
        // 3. Obtener producto por ID
        let getRes = http.get(`${BASE_URL}/${productId}`);
        check(getRes, {
            'obtener producto status 200': (r) => r.status === 200,
        });

        // 4. Actualizar producto
        const updateData = {
            name: `Producto k6 actualizado ${Math.floor(Math.random() * 1000)}`,
            description: 'Descripción actualizada por k6',
            price: Math.floor(Math.random() * 100) + 1,
        };
        let updateRes = http.put(`${BASE_URL}/${productId}`, JSON.stringify(updateData), {
            headers: { 'Content-Type': 'application/json' },
        });
        check(updateRes, {
            'actualizar producto status 200': (r) => r.status === 200,
        });

        // 5. Eliminar producto
        let deleteRes = http.del(`${BASE_URL}/${productId}`);
        check(deleteRes, {
            'eliminar producto status 204 o 200': (r) => r.status === 204 || r.status === 200,
        });
    } else {
        console.error('No se obtuvo productId tras crear el producto.');
    }

    sleep(1);
}

// Generar reporte HTML automáticamente al final de la prueba
export function handleSummary(data) {
    return {
        'reporte-k6.html': htmlReport(data),
    };
}