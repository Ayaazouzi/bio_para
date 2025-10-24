<?php
// login_user.php
// Authentification : retourne token (base64 JSON) + user (inclut role)

header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

// DB config
$host = "localhost";
$dbname = "Bio_Para";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion à la base de données"]);
    exit;
}

// get body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if ($data === null) parse_str($raw, $data);

$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['mot_de_passe']) ? $data['mot_de_passe'] : '';

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(["message" => "Email et mot de passe requis"]);
    exit;
}

$email_norm = mb_strtolower($email, 'UTF-8');

try {
    $stmt = $pdo->prepare("SELECT id_user, nom_complet, email, mot_de_passe, phone, role FROM user WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email_norm]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de la requête"]);
    exit;
}

if (!$userData) {
    http_response_code(401);
    echo json_encode(["message" => "Email ou mot de passe incorrect"]);
    exit;
}

$hashFromDb = $userData['mot_de_passe'] ?? '';

if ($hashFromDb === '' || !password_verify($password, $hashFromDb)) {
    http_response_code(401);
    echo json_encode(["message" => "Email ou mot de passe incorrect"]);
    exit;
}

// success : create a simple token (base64 of JSON). For prod use JWT.
$tokenData = [
    "id" => $userData['id_user'],
    "email" => $userData['email'],
    "role" => $userData['role'],
    "iat" => time()
];

$token = base64_encode(json_encode($tokenData));

http_response_code(200);
echo json_encode([
    "message" => "Connexion réussie",
    "token" => $token,
    "user" => [
        "id" => $userData['id_user'],
        "nom_complet" => $userData['nom_complet'],
        "email" => $userData['email'],
        "phone" => $userData['phone'],
        "role" => $userData['role']
    ]
]);
exit;
