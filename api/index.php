<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? $_GET['path'] ?? '';

// Load products data
function loadProducts() {
    $productsFile = __DIR__ . '/../data/products.json';
    if (file_exists($productsFile)) {
        $content = file_get_contents($productsFile);
        return json_decode($content, true) ?: [];
    }
    return [];
}

// Simple routing
switch($path) {
    case '/products':
    case '/api/products':
        if($method === 'GET') {
            $products = loadProducts();
            echo json_encode(['products' => $products, 'count' => count($products)]);
        }
        break;
    
    case '/health':
    case '/api/health':
        echo json_encode([
            'status' => 'healthy', 
            'timestamp' => date('c'),
            'message' => 'Q8 Fruit API is running',
            'version' => '1.0.0'
        ]);
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found', 'path' => $path]);
}
?>