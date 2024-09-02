<?php
session_start(); // Rozpoczynamy sesję
require 'config.php'; // Dołączamy plik konfiguracyjny, który zawiera połączenie z bazą danych

if ($_SERVER['REQUEST_METHOD'] === 'POST') { // Sprawdzamy, czy żądanie zostało wykonane metodą POST
    $user_id = $_SESSION['user_id']; // Pobranie ID zalogowanego użytkownika z sesji
    $name = $_POST['name']; // Pobranie wartości pola "name" z formularza
    $email = $_POST['email']; // Pobranie wartości pola "email" z formularza
    $company = $_POST['company'] ?? null; // Pobranie wartości pola "company" lub ustawienie null, jeśli nie podano
    $phone = $_POST['phone'] ?? null; // Pobranie wartości pola "phone" lub ustawienie null, jeśli nie podano
    $notes = $_POST['notes'] ?? null; // Pobranie wartości pola "notes" lub ustawienie null, jeśli nie podano
    $reminder_date = $_POST['reminderDate']; // Pobranie wartości pola "reminderDate" z formularza
    $reminder_time = $_POST['reminderTime']; // Pobranie wartości pola "reminderTime" z formularza

    try {
        // Przygotowanie zapytania SQL do wstawienia nowego kontaktu do bazy danych
        $stmt = $pdo->prepare('INSERT INTO contacts (user_id, name, email, company, phone, notes, reminder_date, reminder_time) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        // Wykonanie zapytania z przekazanymi danymi
        $stmt->execute([$user_id, $name, $email, $company, $phone, $notes, $reminder_date, $reminder_time]);

        // Wysłanie odpowiedzi JSON informującej o sukcesie operacji
        echo json_encode(['success' => true, 'message' => 'Contact saved successfully']);
    } catch (PDOException $e) {
        // Wysłanie odpowiedzi JSON informującej o błędzie bazy danych
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    // Wysłanie odpowiedzi JSON informującej o błędzie, jeśli metoda żądania jest nieprawidłowa
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
