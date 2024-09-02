<?php
$host = 'localhost';
$db   = 'contact_management';
$user = 'root'; // Zastąp swoją nazwą użytkownika MySQL
$pass = ''; // Zastąp swoim hasłem do MySQL
$charset = 'utf8mb4'; // Ustawienie kodowania znaków na utf8mb4

// Tworzenie DSN (Data Source Name) dla połączenia z bazą danych
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Ustawienie trybu błędów na wyjątki
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Ustawienie domyślnego trybu pobierania na tablice asocjacyjne
    PDO::ATTR_EMULATE_PREPARES   => false, // Wyłączenie emulacji przygotowywanych zapytań przez PDO
];

try {
    // Próba nawiązania połączenia z bazą danych
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // W przypadku niepowodzenia rzuca wyjątek z komunikatem o błędzie
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>
