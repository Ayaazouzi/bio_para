<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

// Récupérer l'ID de l'utilisateur depuis GET
$id_user = isset($_GET['id_user']) ? intval($_GET['id_user']) : 0;

if ($id_user <= 0) {
    echo json_encode(['error' => 'Utilisateur non connecté']);
    exit();
}

// Récupérer le contenu du panier
$stmt = $conn->prepare("
    SELECT p.id_panier, p.id_article, pr.nom_article, pr.image, p.quantite, p.prix_unitaire, p.total
    FROM panier p
    JOIN articles pr ON p.id_article = pr.id_article
    WHERE p.id_user = ?
");
$stmt->execute([$id_user]);
$cart = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calcul du total
$totalPrice = array_sum(array_column($cart, 'total'));

echo json_encode(['cart' => $cart, 'total' => $totalPrice]);
