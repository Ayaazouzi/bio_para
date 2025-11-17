<?php
header("Content-Type: application/json");
include 'checkAdmin.php';
include 'connexionbase.php';

$pdo = getConnection();

// Récupérer les données JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_categorie'], $data['nom_categorie'])) {
    http_response_code(400);
    echo json_encode(["error" => "Paramètres manquants"]);
    exit;
}

$id = $data['id_categorie'];
$nom = $data['nom_categorie'];

try {
    $stmt = $pdo->prepare("UPDATE categories SET nom_categorie = ? WHERE id_categorie = ?");
    $stmt->execute([$nom, $id]);
    echo json_encode(["status" => "success"]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
