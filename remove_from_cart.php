<?php
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require __DIR__ . '/connexionbase.php';
$conn = getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$id_panier = $data['id_article'] ?? null; // id_article = id_panier envoyé par frontend

if (!$id_panier) {
    echo json_encode(['status' => 'error', 'message' => 'ID article manquant']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM panier WHERE id_panier = ?");
    $stmt->execute([$id_panier]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Article introuvable ou déjà supprimé']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}
?>
