<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u423548699_Admin_NEXTMOOV');
define('DB_USER', 'u423548699_Samuelkng');
define('DB_PASS', 'Luckies1975');

define('ADMIN_USER', 'admin');
define('ADMIN_PASS', 'NextMoov2025!');

function db(): PDO {
    static $pdo = null;
    if (!$pdo) {
        $pdo = new PDO(
            'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    }
    return $pdo;
}

function requireAuth(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['admin'])) {
        header('Location: /admin/login.php');
        exit;
    }
}

function h($s): string {
    return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
}
