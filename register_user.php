<?php
// register_user.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 🔹 Connexion à la base de données
$host = "localhost";
$db_name = "Bio_Para";   // ✅ nom de ta base
$username = "root";      // ✅ ton utilisateur MySQL
$password_db = "";       // ✅ mot de passe MySQL (souvent vide sur WAMP)

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password_db);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["message" => "Erreur de connexion : " . $e->getMessage()]);
    exit();
}

// 🔹 Récupération des données JSON envoyées par React
$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data["name"]) &&
    isset($data["email"]) &&
    isset($data["password"]) &&
    isset($data["phone"])
) {
    $nom_complet = trim($data["name"]);
    $email = trim($data["email"]);
    $mot_de_passe = password_hash($data["password"], PASSWORD_DEFAULT);
    $phone = trim($data["phone"]);
    $role = "client"; // 🔸 rôle par défaut

    try {
        // Vérifier si l’email existe déjà
        $check = $conn->prepare("SELECT * FROM user WHERE email = :email");
        $check->bindParam(":email", $email);
        $check->execute();

        if ($check->rowCount() > 0) {
            echo json_encode(["message" => "Cet email est déjà utilisé."]);
            exit();
        }

        // 🔹 Insertion du nouvel utilisateur avec rôle 'client'
        $stmt = $conn->prepare("
            INSERT INTO user (nom_complet, email, mot_de_passe, phone, role)
            VALUES (:nom_complet, :email, :mot_de_passe, :phone, :role)
        ");

        $stmt->bindParam(":nom_complet", $nom_complet);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":mot_de_passe", $mot_de_passe);
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":role", $role);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Inscription réussie !"]);
        } else {
            echo json_encode(["message" => "Erreur lors de l'inscription."]);
        }

    } catch (PDOException $e) {
        echo json_encode(["message" => "Erreur : " . $e->getMessage()]);
    }

} else {
    echo json_encode(["message" => "Données manquantes."]);
}
?>
