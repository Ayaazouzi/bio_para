<?php
include 'checkAdmin.php';
include 'connexionbase.php';
$pdo = getConnection();

try {
    $stats = [];
    $stats['nb_users'] = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $stats['nb_admins'] = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role='admin'")->fetchColumn();
    $stats['nb_clients'] = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role='client'")->fetchColumn();
    $stats['nb_categories'] = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    $stats['nb_articles'] = (int)$pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
    echo json_encode($stats);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error"=>$e->getMessage()]);
}
?>
