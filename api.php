<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Base paths
$baseDir = dirname(__FILE__);
$dataDir = $baseDir . '/data';
$productsFile = $dataDir . '/products.json';
$notificationsFile = $dataDir . '/notifications.json';

// Ensure data directory exists
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Initialize files if they don't exist
if (!file_exists($productsFile)) {
    file_put_contents($productsFile, '[]');
}
if (!file_exists($notificationsFile)) {
    file_put_contents($notificationsFile, '[]');
}

// Get request path
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$pathSegments = explode('/', trim($path, '/'));

// Remove 'api' from path if present
if (isset($pathSegments[0]) && $pathSegments[0] === 'api') {
    array_shift($pathSegments);
}

$endpoint = $pathSegments[0] ?? '';
$id = $pathSegments[1] ?? null;

// Helper functions
function readJsonFile($filename) {
    if (!file_exists($filename)) {
        return [];
    }
    $content = file_get_contents($filename);
    return json_decode($content, true) ?: [];
}

function writeJsonFile($filename, $data) {
    return file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Track product count for notifications
$lastCountFile = $dataDir . '/last_count.txt';
$lastProductCount = 0;
if (file_exists($lastCountFile)) {
    $lastProductCount = (int)file_get_contents($lastCountFile);
}

// Handle different endpoints
switch ($endpoint) {
    case 'products':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $products = readJsonFile($productsFile);
            
            // Check for new products and create notifications
            if (count($products) > $lastProductCount) {
                $newProducts = array_slice($products, $lastProductCount);
                $notifications = readJsonFile($notificationsFile);
                
                foreach ($newProducts as $product) {
                    $notification = [
                        'id' => time() + rand(1, 1000),
                        'type' => 'new_product',
                        'title' => 'منتج جديد متوفر!',
                        'message' => 'تم إضافة ' . $product['name']['ar'] . ' إلى المتجر',
                        'productName' => $product['name']['ar'],
                        'productId' => $product['id'],
                        'timestamp' => date('c'),
                        'read' => false
                    ];
                    array_unshift($notifications, $notification);
                }
                
                // Keep only last 50 notifications
                $notifications = array_slice($notifications, 0, 50);
                writeJsonFile($notificationsFile, $notifications);
                
                // Update last count
                file_put_contents($lastCountFile, count($products));
            }
            
            sendResponse(['success' => true, 'data' => $products]);
        }
        break;
        
    case 'notifications':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $notifications = readJsonFile($notificationsFile);
            sendResponse(['success' => true, 'data' => $notifications]);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $id && isset($pathSegments[2]) && $pathSegments[2] === 'read') {
            $notifications = readJsonFile($notificationsFile);
            foreach ($notifications as &$notification) {
                if ($notification['id'] == $id) {
                    $notification['read'] = true;
                    break;
                }
            }
            writeJsonFile($notificationsFile, $notifications);
            sendResponse(['success' => true, 'message' => 'Notification marked as read']);
        }
        break;
        
    case 'health':
        sendResponse([
            'status' => 'healthy',
            'timestamp' => date('c'),
            'productCount' => count(readJsonFile($productsFile))
        ]);
        break;
        
    default:
        sendResponse(['success' => false, 'error' => 'Endpoint not found'], 404);
}
?>