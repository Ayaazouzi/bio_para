<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

try {
    $stmt = $pdo->prepare("DELETE FROM articles WHERE id_article=?");
    $stmt->execute([$data['id_article']]);
    echo json_encode(["status" => "success"]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
