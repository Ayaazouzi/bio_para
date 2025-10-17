<?php
// get_dashboard_data.php

// Headers pour CORS et JSON
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

// Connexion à la base
$host = "localhost";
$dbname = "Bio_Para";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de connexion à la base : " . $e->getMessage()]);
    exit;
}

// Vérification du token (optionnel si tu veux sécuriser l'accès)
$headers = getallheaders();
$auth = $headers['Authorization'] ?? '';
if (!$auth || !preg_match('/Bearer\s(\S+)/', $auth, $m)) {
    http_response_code(401);
    echo json_encode(["error" => "Token manquant ou invalide"]);
    exit;
}
$token = $m[1];
$decoded = json_decode(base64_decode($token), true);
if (!$decoded || !isset($decoded['role']) || $decoded['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Accès refusé"]);
    exit;
}

// Récupération des statistiques
try {
    $stats = [
        "nb_users"      => (int)$pdo->query("SELECT COUNT(*) FROM user")->fetchColumn(),
        "nb_admins"     => (int)$pdo->query("SELECT COUNT(*) FROM user WHERE role='admin'")->fetchColumn(),
        "nb_clients"    => (int)$pdo->query("SELECT COUNT(*) FROM user WHERE role='client'")->fetchColumn(),
        "nb_categories" => (int)$pdo->query("SELECT COUNT(*) FROM categorie")->fetchColumn(),
        "nb_articles"   => (int)$pdo->query("SELECT COUNT(*) FROM article")->fetchColumn()
    ];

    echo json_encode($stats);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur SQL : " . $e->getMessage()]);
    exit;
}
?>
