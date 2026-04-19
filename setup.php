<?php
require __DIR__.'/admin/config.php';

try {
    $pdo = db();

    $pdo->exec("CREATE TABLE IF NOT EXISTS athletes (
        id           INT PRIMARY KEY AUTO_INCREMENT,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        name         VARCHAR(255) NOT NULL,
        sport        VARCHAR(100) NOT NULL,
        position     VARCHAR(100),
        school_origin VARCHAR(255),
        university_us VARCHAR(255),
        state_us     VARCHAR(100),
        season       VARCHAR(50),
        bio          TEXT,
        quote        TEXT,
        motiv        TEXT,
        message      TEXT,
        photo_url    TEXT,
        is_featured  TINYINT(1) DEFAULT 0,
        instagram_url VARCHAR(500)
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS testimonials (
        id           INT PRIMARY KEY AUTO_INCREMENT,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        athlete_name VARCHAR(255) NOT NULL,
        sport        VARCHAR(100) NOT NULL,
        quote        TEXT NOT NULL,
        rating       TINYINT DEFAULT 5,
        photo_url    TEXT,
        university_us VARCHAR(255),
        season       VARCHAR(50),
        is_featured  TINYINT(1) DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS showcase_events (
        id               INT PRIMARY KEY AUTO_INCREMENT,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        title            VARCHAR(255) NOT NULL,
        location         VARCHAR(255) NOT NULL,
        event_date       DATE NOT NULL,
        description      TEXT,
        sports           VARCHAR(500),
        capacity         INT,
        registration_url VARCHAR(500),
        photo_url        TEXT,
        is_published     TINYINT(1) DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS social_posts (
        id           INT PRIMARY KEY AUTO_INCREMENT,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        platform     ENUM('instagram','tiktok','youtube','twitter') NOT NULL,
        post_url     TEXT NOT NULL,
        caption      TEXT,
        thumbnail_url TEXT,
        is_featured  TINYINT(1) DEFAULT 0,
        published_at TIMESTAMP NULL
    )");

    echo '<div style="font-family:sans-serif;padding:2rem;max-width:500px;margin:auto">';
    echo '<h2 style="color:green;margin-bottom:1rem">✅ Tables créées avec succès !</h2>';
    echo '<p><a href="/admin/login.php" style="color:#000769">→ Accéder à l\'admin</a></p>';
    echo '<p style="color:orange;margin-top:1rem;font-size:.85rem">⚠️ Supprimez ce fichier setup.php après utilisation.</p>';
    echo '</div>';

} catch (Exception $e) {
    echo '<div style="font-family:sans-serif;padding:2rem;color:red">';
    echo '<h2>❌ Erreur</h2><pre>'.htmlspecialchars($e->getMessage()).'</pre>';
    echo '</div>';
}
