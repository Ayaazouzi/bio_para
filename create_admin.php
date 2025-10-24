<?php
$data = json_decode(file_get_contents("php://input"), true);
file_put_contents("log_add_to_cart.txt", print_r($data, true), FILE_APPEND);

// Vérif données
if (!isset($data['id_article'], $data['quantity'], $data['price'], $data['id_user'])) {
    echo json_encode(['error' => 'Données manquantes']);
    exit();
}

$id_article = intval($data['id_article']);
$quantite = intval($data['quantity']);
$prix_unitaire = floatval($data['price']);
$id_user = intval($data['id_user']);
$total = $prix_unitaire * $quantite;

if ($id_article <= 0 || $quantite <= 0 || $prix_unitaire <= 0 || $id_user <= 0) {
    echo json_encode(['error' => 'Valeurs invalides']);
    exit();
}

// Vérifier produit
$stmtProduct = $conn->prepare("SELECT id_article FROM articles WHERE id_article = ?");
$stmtProduct->execute([$id_article]);
if (!$stmtProduct->fetch()) {
    echo json_encode(['error' => 'Produit inexistant']);
    exit();
}

// Vérifier panier
$stmtCheck = $conn->prepare("SELECT id_panier, quantite FROM panier WHERE id_article = ? AND id_user = ?");
$stmtCheck->execute([$id_article, $id_user]);
$existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    $newQuantite = $existing['quantite'] + $quantite;
    $newTotal = $prix_unitaire * $newQuantite;

    $stmtUpdate = $conn->prepare("UPDATE panier SET quantite = ?, total = ? WHERE id_panier = ? AND id_user = ?");
    $stmtUpdate->execute([$newQuantite, $newTotal, $existing['id_panier'], $id_user]);

    echo json_encode([
        'success' => true,
        'message' => 'Quantité mise à jour',
        'new_quantity' => $newQuantite
    ]);
} else {
    $stmtInsert = $conn->prepare("INSERT INTO panier (id_user, id_article, quantite, prix_unitaire, total) VALUES (?, ?, ?, ?, ?)");
    $stmtInsert->execute([$id_user, $id_article, $quantite, $prix_unitaire, $total]);

    echo json_encode([
        'success' => true,
        'message' => 'Produit ajouté au panier',
        'id_panier' => $conn->lastInsertId()
    ]);
}
