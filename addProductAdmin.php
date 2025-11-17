<?php
// -------------------- CORS --------------------
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/connexionbase.php';  // connexion à MySQL
$pdo = getConnection();

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nom_article'], $data['description'], $data['prix'], $data['id_categorie'])) {
    http_response_code(400);
    echo json_encode(["error"=>"Paramètres manquants"]);
    exit;
}

$image = $data['image'] ?? "";
$promo = $data['promo'] ?? 0;

try {
    $stmt = $pdo->prepare("INSERT INTO articles (nom_article, description, prix, image, id_categorie, promo) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['nom_article'], $data['description'], $data['prix'], $image, $data['id_categorie'], $promo]);
    echo json_encode(["status"=>"success", "id_article"=>$pdo->lastInsertId()]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error"=>$e->getMessage()]);
}
?>
