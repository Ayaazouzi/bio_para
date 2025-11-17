<?php
// checkAdmin.php
header('Content-Type: application/json');
session_start();

// Pour test local : on force un utilisateur admin
// Supprime ou commente cette ligne en production
$_SESSION['role'] = 'admin';

// Vérification de l'admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Accès refusé - Vous devez être administrateur"]);
    exit;
}

// Si on arrive ici, l'accès est autorisé
// Rien à faire : le script appelant continue normalement
?>
