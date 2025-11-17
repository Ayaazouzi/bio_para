<?php
include __DIR__ . '/checkAdmin.php';
include __DIR__ . '/connexionbase.php';

$pdo = getConnection();
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nom_categorie'])) {
    http_response_code(400);
    die(json_encode(["error"=>"nom_categorie manquant"]));
}

try {
    $stmt = $pdo->prepare("INSERT INTO categories (nom_categorie) VALUES (?)");
    $stmt->execute([$data['nom_categorie']]);
    echo json_encode(["status"=>"success","id_categorie"=>$pdo->lastInsertId()]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error"=>$e->getMessage()]);
}
?>
