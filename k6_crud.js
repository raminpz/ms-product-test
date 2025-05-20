import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
    stages: [
        { duration: '10s', target: 5 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'],
        http_req_duration: ['p(95)<500'],
    },
};

const BASE_URL = 'http://api:8080/api/products';

const productsToPost = [
    { name: 'Producto A', description: 'Descripción A', price: 10 },
];

export default function () {
    const newProduct = productsToPost[Math.floor(Math.random() * productsToPost.length)];

    // 1. Listar productos
    let listRes = http.get(BASE_URL);
    check(listRes, {
        'listar productos status 200': (r) => r.status === 200,
        'listar productos no vacío': (r) => Array.isArray(r.json()) && r.json().length >= 0,
    });

    // 2. Crear producto
    let createRes = http.post(BASE_URL, JSON.stringify(newProduct), {
        headers: { 'Content-Type': 'application/json' },
    });

    const productId = createRes.json('id');
    const createdOk = check(createRes, {
        'crear producto status 201': (r) => r.status === 201,
        'producto creado tiene id': () => productId !== undefined && productId !== null,
    });

    if (!createdOk) {
        return;
    }

    // 3. Obtener producto
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

    sleep(1);
}

export function handleSummary(data) {
    return {
        'reporte-k6.html': htmlReport(data),
    };
}