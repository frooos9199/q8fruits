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

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? $_GET['path'] ?? '';

// File paths
$productsFile = __DIR__ . '/../data/products.json';
$ordersFile = __DIR__ . '/../data/orders.json';
$usersFile = __DIR__ . '/../data/users.json';
$settingsFile = __DIR__ . '/../data/settings.json';
$backupDir = __DIR__ . '/../data/backups/';

// Ensure directories exist
if (!file_exists(dirname($productsFile))) {
    mkdir(dirname($productsFile), 0755, true);
}
if (!file_exists($backupDir)) {
    mkdir($backupDir, 0755, true);
}

// Load products from file
function loadProducts() {
    global $productsFile;
    if (file_exists($productsFile)) {
        $content = file_get_contents($productsFile);
        $products = json_decode($content, true);
        return $products ?: [];
    }
    return getDefaultProducts();
}

// Save products to file with backup
function saveProducts($products) {
    global $productsFile, $backupDir;
    return saveDataToFile($productsFile, $products, 'products');
}

// Generic function to save data with backup
function saveDataToFile($filePath, $data, $prefix) {
    global $backupDir;
    
    // Create backup before saving
    if (file_exists($filePath)) {
        $backupName = $prefix . '_backup_' . date('Y-m-d_H-i-s') . '.json';
        copy($filePath, $backupDir . $backupName);
        
        // Keep only last 10 backups
        $backups = glob($backupDir . $prefix . '_backup_*.json');
        if (count($backups) > 10) {
            array_multisort(array_map('filemtime', $backups), SORT_ASC, $backups);
            for ($i = 0; $i < count($backups) - 10; $i++) {
                unlink($backups[$i]);
            }
        }
    }
    
    $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($filePath, $jsonData) !== false;
}

// Load orders from file
function loadOrders() {
    global $ordersFile;
    if (file_exists($ordersFile)) {
        $content = file_get_contents($ordersFile);
        $orders = json_decode($content, true);
        return $orders ?: [];
    }
    return [];
}

// Save orders to file
function saveOrders($orders) {
    global $ordersFile;
    return saveDataToFile($ordersFile, $orders, 'orders');
}

// Load users from file
function loadUsers() {
    global $usersFile;
    if (file_exists($usersFile)) {
        $content = file_get_contents($usersFile);
        $users = json_decode($content, true);
        return $users ?: [];
    }
    return [];
}

// Save users to file
function saveUsers($users) {
    global $usersFile;
    return saveDataToFile($usersFile, $users, 'users');
}

// Load settings from file
function loadSettings() {
    global $settingsFile;
    if (file_exists($settingsFile)) {
        $content = file_get_contents($settingsFile);
        $settings = json_decode($content, true);
        return $settings ?: getDefaultSettings();
    }
    return getDefaultSettings();
}

// Save settings to file
function saveSettings($settings) {
    global $settingsFile;
    return saveDataToFile($settingsFile, $settings, 'settings');
}

// Get default settings
function getDefaultSettings() {
    return [
        'deliveryPrices' => [
            'salmiya' => 2.000,
            'hawalli' => 2.500,
            'ahmadi' => 3.000
        ],
        'deliveryTimes' => [
            'salmiya' => '30-45 دقيقة',
            'hawalli' => '45-60 دقيقة', 
            'ahmadi' => '60-90 دقيقة'
        ],
        'workingHours' => [
            'start' => '08:00',
            'end' => '22:00'
        ],
        'minimumOrder' => 5.000,
        'taxRate' => 0.0,
        'currency' => 'KWD'
    ];
}

// Get default products
function getDefaultProducts() {
    return [
        [
            "id" => 1,
            "name" => ["ar" => "تفاح", "en" => "Apple"],
            "category" => "fruits",
            "units" => [
                ["id" => 1, "unit" => ["ar" => "كيلو", "en" => "kg"], "price" => 2.500, "isDefault" => true]
            ],
            "image" => "/images/products/apple.svg",
            "tags" => ["طازج", "جودة عالية"],
            "description" => ["ar" => "تفاح أحمر طازج وعالي الجودة", "en" => "Fresh high-quality red apples"],
            "isPublished" => true,
            "stock" => 50,
            "minStock" => 10,
            "barcode" => "",
            "supplier" => "",
            "origin" => ["ar" => "لبنان", "en" => "Lebanon"],
            "nutritionFacts" => [
                "calories" => "52",
                "protein" => "0.3",
                "carbs" => "14",
                "fat" => "0.2",
                "fiber" => "2.4",
                "vitamins" => "فيتامين C"
            ],
            "storageInstructions" => ["ar" => "يحفظ في الثلاجة", "en" => "Store in refrigerator"],
            "isOrganic" => false,
            "isFresh" => true,
            "shelfLife" => "7-10 أيام",
            "discount" => [
                "enabled" => false,
                "percentage" => 0,
                "startDate" => "",
                "endDate" => ""
            ]
        ],
        [
            "id" => 2,
            "name" => ["ar" => "برتقال", "en" => "Orange"],
            "category" => "fruits",
            "units" => [
                ["id" => 1, "unit" => ["ar" => "كيلو", "en" => "kg"], "price" => 2.000, "isDefault" => true]
            ],
            "image" => "/images/products/orange.svg",
            "tags" => ["فيتامين سي", "طازج"],
            "description" => ["ar" => "برتقال طازج غني بفيتامين سي", "en" => "Fresh oranges rich in Vitamin C"],
            "isPublished" => true,
            "stock" => 40,
            "minStock" => 10,
            "barcode" => "",
            "supplier" => "",
            "origin" => ["ar" => "مصر", "en" => "Egypt"],
            "nutritionFacts" => [
                "calories" => "47",
                "protein" => "0.9",
                "carbs" => "12",
                "fat" => "0.1",
                "fiber" => "2.4",
                "vitamins" => "فيتامين C"
            ],
            "storageInstructions" => ["ar" => "يحفظ في درجة حرارة الغرفة", "en" => "Store at room temperature"],
            "isOrganic" => false,
            "isFresh" => true,
            "shelfLife" => "7 أيام",
            "discount" => [
                "enabled" => false,
                "percentage" => 0,
                "startDate" => "",
                "endDate" => ""
            ]
        ],
        [
            "id" => 3,
            "name" => ["ar" => "موز", "en" => "Banana"],
            "category" => "fruits",
            "units" => [
                ["id" => 1, "unit" => ["ar" => "كيلو", "en" => "kg"], "price" => 1.500, "isDefault" => true]
            ],
            "image" => "/images/products/banana.svg",
            "tags" => ["بوتاسيوم", "طاقة"],
            "description" => ["ar" => "موز طازج غني بالبوتاسيوم", "en" => "Fresh bananas rich in potassium"],
            "isPublished" => true,
            "stock" => 30,
            "minStock" => 5,
            "barcode" => "",
            "supplier" => "",
            "origin" => ["ar" => "الفلبين", "en" => "Philippines"],
            "nutritionFacts" => [
                "calories" => "89",
                "protein" => "1.1",
                "carbs" => "23",
                "fat" => "0.3",
                "fiber" => "2.6",
                "vitamins" => "فيتامين B6"
            ],
            "storageInstructions" => ["ar" => "يحفظ في درجة حرارة الغرفة", "en" => "Store at room temperature"],
            "isOrganic" => false,
            "isFresh" => true,
            "shelfLife" => "5-7 أيام",
            "discount" => [
                "enabled" => false,
                "percentage" => 0,
                "startDate" => "",
                "endDate" => ""
            ]
        ],
        [
            "id" => 4,
            "name" => ["ar" => "عنب", "en" => "Grapes"],
            "category" => "fruits",
            "units" => [
                ["id" => 1, "unit" => ["ar" => "كيلو", "en" => "kg"], "price" => 4.000, "isDefault" => true]
            ],
            "image" => "/images/products/grapes.svg",
            "tags" => ["مضادات الأكسدة", "حلو"],
            "description" => ["ar" => "عنب طازج وحلو غني بمضادات الأكسدة", "en" => "Fresh sweet grapes rich in antioxidants"],
            "isPublished" => true,
            "stock" => 25,
            "minStock" => 5,
            "barcode" => "",
            "supplier" => "",
            "origin" => ["ar" => "تركيا", "en" => "Turkey"],
            "nutritionFacts" => [
                "calories" => "62",
                "protein" => "0.6",
                "carbs" => "16",
                "fat" => "0.2",
                "fiber" => "0.9",
                "vitamins" => "فيتامين C, K"
            ],
            "storageInstructions" => ["ar" => "يحفظ في الثلاجة", "en" => "Store in refrigerator"],
            "isOrganic" => false,
            "isFresh" => true,
            "shelfLife" => "5-7 أيام",
            "discount" => [
                "enabled" => false,
                "percentage" => 0,
                "startDate" => "",
                "endDate" => ""
            ]
        ],
        [
            "id" => 5,
            "name" => ["ar" => "مانجو", "en" => "Mango"],
            "category" => "fruits",
            "units" => [
                ["id" => 1, "unit" => ["ar" => "كيلو", "en" => "kg"], "price" => 3.500, "isDefault" => true]
            ],
            "image" => "/images/products/mango.svg",
            "tags" => ["استوائي", "فيتامين A"],
            "description" => ["ar" => "مانجو استوائي طازج وحلو", "en" => "Fresh sweet tropical mango"],
            "isPublished" => true,
            "stock" => 20,
            "minStock" => 5,
            "barcode" => "",
            "supplier" => "",
            "origin" => ["ar" => "الهند", "en" => "India"],
            "nutritionFacts" => [
                "calories" => "60",
                "protein" => "0.8",
                "carbs" => "15",
                "fat" => "0.4",
                "fiber" => "1.6",
                "vitamins" => "فيتامين A, C"
            ],
            "storageInstructions" => ["ar" => "يحفظ في درجة حرارة الغرفة حتى ينضج", "en" => "Store at room temperature until ripe"],
            "isOrganic" => false,
            "isFresh" => true,
            "shelfLife" => "5-7 أيام",
            "discount" => [
                "enabled" => false,
                "percentage" => 0,
                "startDate" => "",
                "endDate" => ""
            ]
        ],
        [
            "id" => 6,
            "name" => ["ar" => "فراولة", "en" => "Strawberry"],
            "category" => "fruits",
            "units" => [
                ["id" => 1, "unit" => ["ar" => "كيلو", "en" => "kg"], "price" => 5.000, "isDefault" => true]
            ],
            "image" => "/images/products/strawberry.svg",
            "tags" => ["فيتامين سي", "حلو"],
            "description" => ["ar" => "فراولة طازجة وحلوة غنية بفيتامين سي", "en" => "Fresh sweet strawberries rich in Vitamin C"],
            "isPublished" => true,
            "stock" => 15,
            "minStock" => 3,
            "barcode" => "",
            "supplier" => "",
            "origin" => ["ar" => "مصر", "en" => "Egypt"],
            "nutritionFacts" => [
                "calories" => "32",
                "protein" => "0.7",
                "carbs" => "8",
                "fat" => "0.3",
                "fiber" => "2",
                "vitamins" => "فيتامين C"
            ],
            "storageInstructions" => ["ar" => "يحفظ في الثلاجة", "en" => "Store in refrigerator"],
            "isOrganic" => false,
            "isFresh" => true,
            "shelfLife" => "3-5 أيام",
            "discount" => [
                "enabled" => false,
                "percentage" => 0,
                "startDate" => "",
                "endDate" => ""
            ]
        ],
        [
            "id" => 7,
            "name" => ["ar" => "كيوي", "en" => "Kiwi"],
            "category" => "fruits",
            "units" => [
                ["id" => 1, "unit" => ["ar" => "كيلو", "en" => "kg"], "price" => 3.000, "isDefault" => true]
            ],
            "image" => "/images/products/kiwi.svg",
            "tags" => ["فيتامين سي", "ألياف"],
            "description" => ["ar" => "كيوي طازج غني بفيتامين سي والألياف", "en" => "Fresh kiwi rich in Vitamin C and fiber"],
            "isPublished" => true,
            "stock" => 18,
            "minStock" => 3,
            "barcode" => "",
            "supplier" => "",
            "origin" => ["ar" => "نيوزيلندا", "en" => "New Zealand"],
            "nutritionFacts" => [
                "calories" => "61",
                "protein" => "1.1",
                "carbs" => "15",
                "fat" => "0.5",
                "fiber" => "3",
                "vitamins" => "فيتامين C, K"
            ],
            "storageInstructions" => ["ar" => "يحفظ في درجة حرارة الغرفة حتى ينضج", "en" => "Store at room temperature until ripe"],
            "isOrganic" => false,
            "isFresh" => true,
            "shelfLife" => "7-10 أيام",
            "discount" => [
                "enabled" => false,
                "percentage" => 0,
                "startDate" => "",
                "endDate" => ""
            ]
        ]
    ];
}

// Log API calls
function logApiCall($method, $path, $data = null) {
    $logFile = __DIR__ . '/../data/api_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $logEntry = "[$timestamp] IP: $ip | Method: $method | Path: $path | UserAgent: $userAgent\n";
    if ($data) {
        $logEntry .= "Data: " . json_encode($data) . "\n";
    }
    $logEntry .= "---\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Route handling
switch($path) {
    case '/products':
    case '/api/products':
        logApiCall($method, $path);
        
        if ($method === 'GET') {
            $products = loadProducts();
            echo json_encode([
                'success' => true,
                'products' => $products, 
                'count' => count($products),
                'timestamp' => date('c'),
                'source' => 'server_file'
            ]);
        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            logApiCall($method, $path, $input);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                exit;
            }
            
            // Handle different actions
            if (isset($input['action'])) {
                switch ($input['action']) {
                    case 'addOrder':
                        if (!isset($input['order'])) {
                            http_response_code(400);
                            echo json_encode(['success' => false, 'error' => 'Order data missing']);
                            exit;
                        }
                        
                        $orders = loadOrders();
                        $newOrder = $input['order'];
                        $newOrder['createdAt'] = date('c');
                        $newOrder['updatedAt'] = date('c');
                        
                        $orders[] = $newOrder;
                        
                        if (saveOrders($orders)) {
                            echo json_encode([
                                'success' => true,
                                'message' => 'Order added successfully',
                                'order' => $newOrder,
                                'totalOrders' => count($orders)
                            ]);
                        } else {
                            http_response_code(500);
                            echo json_encode(['success' => false, 'error' => 'Failed to save order']);
                        }
                        break;
                        
                    case 'deleteOrder':
                        if (!isset($input['orderId'])) {
                            http_response_code(400);
                            echo json_encode(['success' => false, 'error' => 'Order ID missing']);
                            exit;
                        }
                        
                        $orders = loadOrders();
                        $orderId = $input['orderId'];
                        $orderIndex = -1;
                        
                        for ($i = 0; $i < count($orders); $i++) {
                            if ($orders[$i]['id'] === $orderId) {
                                $orderIndex = $i;
                                break;
                            }
                        }
                        
                        if ($orderIndex >= 0) {
                            array_splice($orders, $orderIndex, 1);
                            if (saveOrders($orders)) {
                                echo json_encode([
                                    'success' => true,
                                    'message' => 'Order deleted successfully',
                                    'totalOrders' => count($orders)
                                ]);
                            } else {
                                http_response_code(500);
                                echo json_encode(['success' => false, 'error' => 'Failed to save orders']);
                            }
                        } else {
                            http_response_code(404);
                            echo json_encode(['success' => false, 'error' => 'Order not found']);
                        }
                        break;
                        
                    case 'sync':
                        $responseData = [];
                        
                        if (isset($input['data']['users'])) {
                            if (saveUsers($input['data']['users'])) {
                                $responseData['users'] = 'synced';
                            }
                        }
                        
                        if (isset($input['data']['orders'])) {
                            if (saveOrders($input['data']['orders'])) {
                                $responseData['orders'] = 'synced';
                            }
                        }
                        
                        if (isset($input['data']['deliverySettings'])) {
                            $currentSettings = loadSettings();
                            $currentSettings['deliveryPrices'] = $input['data']['deliverySettings']['deliveryPrices'] ?? $currentSettings['deliveryPrices'];
                            $currentSettings['deliveryTimes'] = $input['data']['deliverySettings']['deliveryTimes'] ?? $currentSettings['deliveryTimes'];
                            
                            if (saveSettings($currentSettings)) {
                                $responseData['settings'] = 'synced';
                            }
                        }
                        
                        echo json_encode([
                            'success' => true,
                            'message' => 'Data synced successfully',
                            'synced' => $responseData,
                            'timestamp' => date('c')
                        ]);
                        break;
                        
                    default:
                        // Regular product addition
                        $products = loadProducts();
                        
                        // Generate new ID
                        $maxId = 0;
                        foreach ($products as $product) {
                            if ($product['id'] > $maxId) {
                                $maxId = $product['id'];
                            }
                        }
                        $newId = $maxId + 1;
                        
                        // Add new product
                        $newProduct = $input;
                        unset($newProduct['action']); // Remove action field
                        $newProduct['id'] = $newId;
                        $newProduct['createdAt'] = date('c');
                        $newProduct['updatedAt'] = date('c');
                        
                        $products[] = $newProduct;
                        
                        if (saveProducts($products)) {
                            echo json_encode([
                                'success' => true,
                                'message' => 'Product added successfully',
                                'product' => $newProduct,
                                'totalProducts' => count($products),
                                'timestamp' => date('c')
                            ]);
                        } else {
                            http_response_code(500);
                            echo json_encode(['success' => false, 'error' => 'Failed to save product']);
                        }
                }
            } else {
                // Regular product addition (backward compatibility)
                $products = loadProducts();
                
                // Generate new ID
                $maxId = 0;
                foreach ($products as $product) {
                    if ($product['id'] > $maxId) {
                        $maxId = $product['id'];
                    }
                }
                $newId = $maxId + 1;
                
                // Add new product
                $newProduct = $input;
                $newProduct['id'] = $newId;
                $newProduct['createdAt'] = date('c');
                $newProduct['updatedAt'] = date('c');
                
                $products[] = $newProduct;
                
                if (saveProducts($products)) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Product added successfully',
                        'product' => $newProduct,
                        'totalProducts' => count($products),
                        'timestamp' => date('c')
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'error' => 'Failed to save product']);
                }
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    case '/orders':
    case '/api/orders':
        logApiCall($method, $path);
        
        if ($method === 'GET') {
            $orders = loadOrders();
            echo json_encode([
                'success' => true,
                'orders' => $orders,
                'count' => count($orders),
                'timestamp' => date('c')
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    case '/users':
    case '/api/users':
        logApiCall($method, $path);
        
        if ($method === 'GET') {
            $users = loadUsers();
            echo json_encode([
                'success' => true,
                'users' => $users,
                'count' => count($users),
                'timestamp' => date('c')
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    case '/settings':
    case '/api/settings':
        logApiCall($method, $path);
        
        if ($method === 'GET') {
            $settings = loadSettings();
            echo json_encode([
                'success' => true,
                'settings' => $settings,
                'timestamp' => date('c')
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;
    
    case '/health':
    case '/api/health':
        logApiCall($method, $path);
        echo json_encode([
            'status' => 'healthy',
            'timestamp' => date('c'),
            'message' => 'Q8 Fruit API is running',
            'version' => '2.0.0',
            'endpoints' => [
                'GET /api/products' => 'Get all products',
                'POST /api/products' => 'Add new product or perform actions',
                'GET /api/orders' => 'Get all orders',
                'GET /api/users' => 'Get all users',
                'GET /api/settings' => 'Get system settings',
                'GET /api/health' => 'Health check',
                'GET /api/sync' => 'Get sync data',
                'POST /api/sync' => 'Sync data'
            ],
            'productsCount' => count(loadProducts())
        ]);
        break;
    
    case '/sync':
    case '/api/sync':
        logApiCall($method, $path);
        
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            logApiCall($method, $path, $input);
            
            if (!$input || !isset($input['products'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid sync data']);
                exit;
            }
            
            // Save synced products
            if (saveProducts($input['products'])) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Products synced successfully',
                    'count' => count($input['products']),
                    'timestamp' => date('c')
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to sync products']);
            }
        } else {
            // Return current products for sync
            $products = loadProducts();
            echo json_encode([
                'success' => true,
                'products' => $products,
                'count' => count($products),
                'timestamp' => date('c')
            ]);
        }
        break;

    case '/data':
    case '/api/data':
        logApiCall($method, $path);
        
        if ($method === 'GET') {
            // Get query parameter for specific data type
            $dataType = $_GET['type'] ?? 'all';
            
            switch ($dataType) {
                case 'orders':
                    $data = loadOrders();
                    echo json_encode([
                        'success' => true,
                        'data' => $data,
                        'type' => 'orders',
                        'count' => count($data),
                        'timestamp' => date('c')
                    ]);
                    break;
                    
                case 'users':
                    $data = loadUsers();
                    echo json_encode([
                        'success' => true,
                        'data' => $data,
                        'type' => 'users',
                        'count' => count($data),
                        'timestamp' => date('c')
                    ]);
                    break;
                    
                case 'settings':
                    $data = loadSettings();
                    echo json_encode([
                        'success' => true,
                        'data' => $data,
                        'type' => 'settings',
                        'timestamp' => date('c')
                    ]);
                    break;
                    
                default:
                    // Return all data
                    echo json_encode([
                        'success' => true,
                        'data' => [
                            'products' => loadProducts(),
                            'orders' => loadOrders(),
                            'users' => loadUsers(),
                            'settings' => loadSettings()
                        ],
                        'timestamp' => date('c')
                    ]);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;
    
    default:
        http_response_code(404);
        logApiCall($method, $path);
        echo json_encode([
            'success' => false,
            'error' => 'Endpoint not found',
            'path' => $path,
            'availableEndpoints' => [
                'GET /api/products',
                'POST /api/products',
                'GET /api/health',
                'GET /api/sync',
                'POST /api/sync'
            ]
        ]);
}
?>