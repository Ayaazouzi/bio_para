<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connexionbase.php';
$conn = getConnection();

try {
    $stmt = $conn->prepare("SELECT * FROM articles WHERE promo = 1");
    $stmt->execute();
    $promotions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['promotions' => $promotions]);
} catch (Exception $e) {
    echo json_encode(['promotions' => [], 'error' => $e->getMessage()]);
}
?>
