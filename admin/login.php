<?php
require __DIR__.'/config.php';
if (session_status() === PHP_SESSION_NONE) session_start();

if (!empty($_SESSION['admin'])) { header('Location: /admin/'); exit; }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (($_POST['user'] ?? '') === ADMIN_USER && ($_POST['pass'] ?? '') === ADMIN_PASS) {
        $_SESSION['admin'] = true;
        header('Location: /admin/');
        exit;
    }
    $error = 'Identifiants incorrects.';
}
?><!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NextMoov Admin — Connexion</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#00020e;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif}
.box{background:#0a0c1a;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:2.5rem;width:360px}
.logo{text-align:center;margin-bottom:2rem}
.logo-brand{color:#fff;font-weight:900;font-size:1.2rem;letter-spacing:3px}
.logo-sub{color:#C0A060;font-size:.7rem;letter-spacing:4px;margin-top:.2rem}
label{display:block;color:rgba(255,255,255,.45);font-size:.75rem;letter-spacing:1px;text-transform:uppercase;margin-bottom:.4rem}
input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:.75rem 1rem;color:#fff;font-size:.95rem;outline:none;margin-bottom:1.2rem;transition:border .2s}
input:focus{border-color:#000769}
button{width:100%;background:#000769;color:#fff;border:none;border-radius:6px;padding:.85rem;font-size:.9rem;font-weight:700;cursor:pointer;letter-spacing:1.5px;text-transform:uppercase;transition:background .2s}
button:hover{background:#0009c0}
.error{background:rgba(178,34,52,.15);border:1px solid rgba(178,34,52,.3);color:#ff6b7a;border-radius:6px;padding:.75rem 1rem;margin-bottom:1.2rem;font-size:.85rem}
</style>
</head>
<body>
<div class="box">
  <div class="logo">
    <div class="logo-brand">NEXT<span style="color:#B22234">MOOV</span></div>
    <div class="logo-sub">USA · ADMIN</div>
  </div>
  <?php if ($error): ?><div class="error"><?= h($error) ?></div><?php endif ?>
  <form method="POST">
    <label>Identifiant</label>
    <input type="text" name="user" placeholder="admin" required autofocus>
    <label>Mot de passe</label>
    <input type="password" name="pass" placeholder="••••••••" required>
    <button type="submit">Connexion</button>
  </form>
</div>
</body>
</html>
