<?php
require 'db.php';
$conn = getConnection();

$id_article = $_POST['id_article'];
$quantity = $_POST['quantity'];

$stmt = $conn->prepare("SELECT prix_unitaire FROM panier WHERE id_article = ?");
$stmt->execute([$id_article]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);

$total = $item['prix_unitaire'] * $quantity;

$stmt = $conn->prepare("UPDATE panier SET quantite = ?, total = ? WHERE id_article = ?");
$stmt->execute([$quantity, $total, $id_article]);

echo json_encode(['status' => 'success']);
?>
