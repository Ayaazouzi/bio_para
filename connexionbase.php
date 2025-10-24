<?php
function getConnection() {
    $host = "localhost"; 
    $dbname = "Bio_Para";
    $username = "root";
    $password = ""; 

    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
        exit;
    }
}
?>
