<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// File path to products
$productsFile = __DIR__ . '/../data/products.json';

// Check if file exists
if (!file_exists($productsFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Products file not found']);
    exit();
}

// Read and return products
try {
    $productsContent = file_get_contents($productsFile);
    $products = json_decode($productsContent, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid JSON format']);
        exit();
    }
    
    // Filter only published products
    $publishedProducts = array_filter($products, function($product) {
        return isset($product['isPublished']) && $product['isPublished'] === true;
    });
    
    // Return the products
    echo json_encode(array_values($publishedProducts));
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read products: ' . $e->getMessage()]);
}
?>