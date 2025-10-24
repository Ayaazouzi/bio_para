<?php
// Autoriser les requêtes depuis React (CORS)
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // ton front
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Répondre aux requêtes OPTIONS (préflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Inclure la connexion PDO (aucun echo ici !)
include 'connexionbase.php';

// Récupérer les données envoyées depuis React
$data = json_decode(file_get_contents('php://input'), true);
$id_user = $data['id_user'] ?? null;
$cart = $data['cart'] ?? null;

// Vérifier les paramètres
if (!$id_user || !$cart || !is_array($cart)) {
    echo json_encode(['error' => 'Paramètres manquants ou invalides']);
    exit;
}

try {
    $conn->beginTransaction();

    // Calculer le prix total
    $total = 0;
    foreach ($cart as $item) {
        $total += $item['total'];
    }

    // Insérer la commande
    $stmt = $conn->prepare("INSERT INTO orders (id_user, prix_total) VALUES (?, ?)");
    $stmt->execute([$id_user, $total]);
    $order_id = $conn->lastInsertId();

    // Insérer les articles de la commande
    $stmtItem = $conn->prepare("INSERT INTO order_items (order_id, id_article, quantity, price) VALUES (?, ?, ?, ?)");
    foreach ($cart as $item) {
        $stmtItem->execute([$order_id, $item['id'], $item['quantity'], $item['price']]);
    }

    $conn->commit();

    echo json_encode(['success' => true, 'order_id' => $order_id]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(['error' => $e->getMessage()]);
}
?>
