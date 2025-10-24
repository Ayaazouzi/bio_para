<?php
// CORS Headers - ABSOLUMENT en premier
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

// Gérer OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$host = "localhost"; 
$dbname = "Bio_Para";
$username = "root";
$password = "";

try {
    // Connexion
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4", 
        $username, 
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Requête
    $stmt = $pdo->query("
        SELECT 
            id_article, 
            nom_article, 
            description, 
            prix, 
            image, 
            id_categorie 
        FROM articles
        ORDER BY id_article ASC
    ");
    
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Retour
    http_response_code(200);
    echo json_encode($articles, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>