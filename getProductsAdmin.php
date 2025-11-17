<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/connexionbase.php';
$pdo = getConnection();

try {
    $stmt = $pdo->query("
        SELECT a.id_article, a.nom_article, a.description, a.prix, a.image, a.id_categorie, a.promo, c.nom_categorie
        FROM articles a
        LEFT JOIN categories c ON a.id_categorie = c.id_categorie
        ORDER BY a.id_article DESC
    ");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products ?: []);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error"=>$e->getMessage(), "products"=>[]]);
}
?>
