<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require __DIR__.'/admin/config.php';

$action = $_GET['action'] ?? '';

try {
    $pdo = db();

    if ($action === 'athletes') {
        $rows = $pdo->query("SELECT * FROM athletes ORDER BY created_at ASC")->fetchAll();
        echo json_encode($rows);

    } elseif ($action === 'testimonials') {
        $rows = $pdo->query("SELECT * FROM testimonials ORDER BY created_at ASC")->fetchAll();
        echo json_encode($rows);

    } elseif ($action === 'showcase') {
        $rows = $pdo->query("SELECT * FROM showcase_events WHERE is_published=1 ORDER BY event_date ASC")->fetchAll();
        echo json_encode($rows);

    } elseif ($action === 'social') {
        $rows = $pdo->query("SELECT * FROM social_posts ORDER BY created_at DESC")->fetchAll();
        echo json_encode($rows);

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'action required']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
