<?php
session_start();
include 'config.php'; 

// Sprawdzenie, czy użytkownik jest zalogowany
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];
$userRole = $_SESSION['role'];

try {
    if ($userRole === 'admin') {
        // Admin - zwraca wszystkie kontakty
        $query = "SELECT * FROM contacts";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
    } else {
        // Zwykły użytkownik - zwraca tylko jego kontakty
        $query = "SELECT * FROM contacts WHERE user_id = :userId";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
    }

    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'contacts' => $contacts
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
