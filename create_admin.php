<?php
// create_admin.php
// Usage: éditer email et password ci-dessous, puis ouvrir http://localhost/parapharmacie-project/create_admin.php
// Après vérification supprimez ce fichier pour des raisons de sécurité.

$host = "localhost";
$dbname = "Bio_Para";
$user = "root";
$pass = "";

$email = "admin@site.com";   // <-- change si tu veux un autre email
$password = "admin123";      // <-- change le mot de passe souhaité
$nom = "Admin Principal";
$phone = "12345678";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Erreur DB: " . $e->getMessage());
}

// Générer le hash
$hash = password_hash($password, PASSWORD_DEFAULT);

// Vérifier si un user avec cet email existe
$stmt = $pdo->prepare("SELECT id_user FROM user WHERE email = :email LIMIT 1");
$stmt->execute(['email' => $email]);
$exists = $stmt->fetch(PDO::FETCH_ASSOC);

if ($exists) {
    // Mettre à jour le mot de passe et role admin
    $upd = $pdo->prepare("UPDATE user SET nom_complet = :nom, mot_de_passe = :hash, phone = :phone, role = 'admin' WHERE email = :email");
    $upd->execute([
        ':nom' => $nom,
        ':hash' => $hash,
        ':phone' => $phone,
        ':email' => $email
    ]);
    echo "Admin mis à jour pour l'email $email\n";
} else {
    // Insérer nouvel admin
    $ins = $pdo->prepare("INSERT INTO user (nom_complet, email, mot_de_passe, phone, role) VALUES (:nom, :email, :hash, :phone, 'admin')");
    $ins->execute([
        ':nom' => $nom,
        ':email' => $email,
        ':hash' => $hash,
        ':phone' => $phone
    ]);
    echo "Admin créé pour l'email $email\n";
}

echo "Mot de passe utilisé (pour test) : $password\n";
echo "=> SUPPRIMEZ create_admin.php dès que tout fonctionne !";
