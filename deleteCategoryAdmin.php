<?php
include __DIR__ . '/checkAdmin.php';
include __DIR__ . '/connexionbase.php';

$pdo = getConnection();
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_categorie'])) {
    http_response_code(400);
    die(json_encode(["error"=>"id_categorie manquant"]));
}

try {
    $stmt = $pdo->prepare("DELETE FROM categories WHERE id_categorie=?");
    $stmt->execute([$data['id_categorie']]);
    echo json_encode(["status"=>"success"]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error"=>$e->getMessage()]);
}
?>
