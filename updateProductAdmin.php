<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include __DIR__ . '/checkAdmin.php';
include __DIR__ . '/connexionbase.php';

$pdo = getConnection();
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_article'])) {
    http_response_code(400);
    die(json_encode(["error" => "id_article manquant"]));
}

$fields = ['nom_article','description','prix','image','id_categorie','promo'];
$updates = [];
$params = [];

foreach ($fields as $f) {
    if (isset($data[$f])) {
        $updates[] = "$f=?";
        $params[] = $data[$f];
    }
}
$params[] = $data['id_article'];

try {
    $stmt = $pdo->prepare("UPDATE articles SET " . implode(", ", $updates) . " WHERE id_article=?");
    $stmt->execute($params);
    echo json_encode(["status" => "success"]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
