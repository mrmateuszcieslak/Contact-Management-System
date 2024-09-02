<?php
session_start(); // Rozpoczynamy sesję
require 'config.php'; // Dołączamy plik konfiguracyjny, w którym znajduje się połączenie z bazą danych

if ($_SERVER['REQUEST_METHOD'] === 'POST') { // Sprawdzamy, czy żądanie zostało wykonane metodą POST
    $email = $_POST['email'];
    $password = md5($_POST['password']); // Haszowanie hasła przed jego zapisaniem

    // Sprawdzanie, czy użytkownik już istnieje
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) { // Jeśli użytkownik nie istnieje
        // Dodanie nowego użytkownika do bazy danych
        $stmt = $pdo->prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
        $stmt->execute([$email, $password, 'user']); // Przypisanie nowemu użytkownikowi roli 'user'
        $userId = $pdo->lastInsertId(); // Pobranie ID nowo dodanego użytkownika
    } else {
        // Jeśli użytkownik już istnieje, używamy istniejącego ID użytkownika
        $userId = $user['id'];
    }

    // Ustawienie zmiennych sesji
    $_SESSION['user_id'] = $userId;
    $_SESSION['email'] = $email;
    $_SESSION['role'] = $user['role'] ?? 'user'; // Domyślna rola 'user', jeśli nie jest ustawiona

    // Wysłanie odpowiedzi z informacją o sukcesie logowania
    echo json_encode([
        'success' => true,
        'email' => $email,
        'role' => $_SESSION['role']
    ]);
} else {
    // Wysłanie odpowiedzi z błędem, jeśli metoda żądania jest nieprawidłowa
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
