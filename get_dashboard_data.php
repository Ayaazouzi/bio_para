<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

// Connexion DB
$host = "localhost";
$dbname = "Bio_Para";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "error" => "Connexion DB échouée",
        "details" => $e->getMessage()
    ]));
}

// Récupération du token (GET, POST ou Header)
$token = null;

if (isset($_GET['token'])) {
    $token = $_GET['token'];
} elseif (isset($_POST['token'])) {
    $token = $_POST['token'];
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['token'])) {
        $token = $input['token'];
    }
}

if (!$token) {
    $authHeader = null;
    
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    }
    
    if ($authHeader && preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
}

if (!$token) {
    http_response_code(401);
    die(json_encode(["error" => "Token manquant"]));
}

// Décoder et valider le token
try {
    $decoded = json_decode(base64_decode($token), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Erreur JSON: " . json_last_error_msg());
    }
    
    if (!$decoded || !isset($decoded['role'])) {
        http_response_code(401);
        die(json_encode(["error" => "Token invalide"]));
    }
    
    if ($decoded['role'] !== 'admin') {
        http_response_code(403);
        die(json_encode(["error" => "Accès refusé - Admin uniquement"]));
    }
} catch (Exception $e) {
    http_response_code(401);
    die(json_encode([
        "error" => "Erreur décodage token",
        "message" => $e->getMessage()
    ]));
}

// Fonction pour trouver le bon nom de table
function getTableName($pdo, $possibleNames) {
    foreach ($possibleNames as $name) {
        try {
            $pdo->query("SELECT 1 FROM $name LIMIT 1");
            return $name;
        } catch (PDOException $e) {
            continue;
        }
    }
    return null;
}

// Récupérer les statistiques avec gestion des noms de tables
try {
    $stats = [];
    
    // Table users/user
    $userTable = getTableName($pdo, ['user', 'users', 'utilisateur', 'utilisateurs']);
    if ($userTable) {
        $stats['nb_users'] = (int)$pdo->query("SELECT COUNT(*) FROM $userTable")->fetchColumn();
        $stats['nb_admins'] = (int)$pdo->query("SELECT COUNT(*) FROM $userTable WHERE role='admin'")->fetchColumn();
        $stats['nb_clients'] = (int)$pdo->query("SELECT COUNT(*) FROM $userTable WHERE role='client'")->fetchColumn();
    } else {
        $stats['nb_users'] = 0;
        $stats['nb_admins'] = 0;
        $stats['nb_clients'] = 0;
    }
    
    // Table categories/categorie
    $categoryTable = getTableName($pdo, ['categorie', 'categories', 'category']);
    if ($categoryTable) {
        $stats['nb_categories'] = (int)$pdo->query("SELECT COUNT(*) FROM $categoryTable")->fetchColumn();
    } else {
        $stats['nb_categories'] = 0;
    }
    
    // Table articles/article
    $articleTable = getTableName($pdo, ['article', 'articles']);
    if ($articleTable) {
        $stats['nb_articles'] = (int)$pdo->query("SELECT COUNT(*) FROM $articleTable")->fetchColumn();
    } else {
        $stats['nb_articles'] = 0;
    }
    
    echo json_encode($stats);
    
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "error" => "Erreur SQL",
        "message" => $e->getMessage()
    ]));
}
?>