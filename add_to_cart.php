<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$host = "localhost";
$dbname = "Bio_Para";
$user = "root";
$pass = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => "Erreur de connexion : " . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_article'], $data['quantity'], $data['price'], $data['id_user'])) {
    echo json_encode(['error' => 'Données manquantes']);
    exit();
}

$id_article = intval($data['id_article']);
$quantite = intval($data['quantity']);
$prix_unitaire = floatval($data['price']);
$id_user = intval($data['id_user']);

if ($id_article <= 0 || $quantite <= 0 || $prix_unitaire <= 0 || $id_user <= 0) {
    echo json_encode(['error' => 'Valeurs invalides']);
    exit();
}

// Vérifier si produit existe
$stmt = $conn->prepare("SELECT id_article FROM articles WHERE id_article = ?");
$stmt->execute([$id_article]);
if (!$stmt->fetch()) {
    echo json_encode(['error' => 'Produit inexistant']);
    exit();
}

// Vérifier si déjà dans le panier
$stmtCheck = $conn->prepare("SELECT id_panier, quantite FROM panier WHERE id_article = ? AND id_user = ?");
$stmtCheck->execute([$id_article, $id_user]);
$existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

$total = $prix_unitaire * $quantite;

if ($existing) {
    $newQuantite = $existing['quantite'] + $quantite;
    $newTotal = $prix_unitaire * $newQuantite;
    $stmtUpdate = $conn->prepare("UPDATE panier SET quantite = ?, total = ? WHERE id_panier = ?");
    $stmtUpdate->execute([$newQuantite, $newTotal, $existing['id_panier']]);
    echo json_encode(['success' => true, 'message' => 'Quantité mise à jour', 'new_quantity' => $newQuantite]);
} else {
    $stmtInsert = $conn->prepare("INSERT INTO panier (id_user, id_article, quantite, prix_unitaire, total) VALUES (?, ?, ?, ?, ?)");
    $stmtInsert->execute([$id_user, $id_article, $quantite, $prix_unitaire, $total]);
    echo json_encode(['success' => true, 'message' => 'Produit ajouté au panier', 'id_panier' => $conn->lastInsertId()]);
}
?>
