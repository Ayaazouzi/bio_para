<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . '/checkAdmin.php';
include __DIR__ . '/connexionbase.php';

$pdo = getConnection();

try {
    $stmt = $pdo->query("SELECT id_categorie, nom_categorie FROM categories");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$categories) $categories = [];

    echo json_encode($categories);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage(), "categories" => []]);
}
?>
