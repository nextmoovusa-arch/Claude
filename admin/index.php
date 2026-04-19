<?php
require __DIR__.'/config.php';
requireAuth();

$section = $_GET['section'] ?? 'athletes';
$action  = $_GET['action']  ?? '';
$id      = (int)($_GET['id'] ?? 0);
$pdo     = db();

/* ─── POST handlers ─── */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act = $_POST['_action'] ?? '';

    if ($act === 'delete') {
        $tables = ['athletes'=>'athletes','temos'=>'testimonials','showcase'=>'showcase_events','social'=>'social_posts'];
        $sec = $_POST['_section'] ?? 'athletes';
        if (isset($tables[$sec])) {
            $pdo->prepare("DELETE FROM {$tables[$sec]} WHERE id=?")->execute([(int)$_POST['id']]);
        }
        header("Location: /admin/index.php?section=$sec"); exit;
    }

    if ($act === 'save_athlete') {
        $p = $_POST;
        $row = [
            ':name'=>trim($p['name']),':sport'=>trim($p['sport']),':position'=>trim($p['position']??''),
            ':school'=>trim($p['school']??''),':university'=>trim($p['university']??''),':state'=>trim($p['state']??''),
            ':season'=>trim($p['season']??''),':bio'=>trim($p['bio']??''),':quote'=>trim($p['quote']??''),
            ':motiv'=>trim($p['motiv']??''),':message'=>trim($p['message']??''),
            ':photo'=>trim($p['photo']??''),':instagram'=>trim($p['instagram']??''),
            ':featured'=>isset($p['featured'])?1:0
        ];
        if ($id) {
            $pdo->prepare("UPDATE athletes SET name=:name,sport=:sport,position=:position,school_origin=:school,university_us=:university,state_us=:state,season=:season,bio=:bio,quote=:quote,motiv=:motiv,message=:message,photo_url=:photo,instagram_url=:instagram,is_featured=:featured WHERE id=$id")->execute($row);
        } else {
            $pdo->prepare("INSERT INTO athletes(name,sport,position,school_origin,university_us,state_us,season,bio,quote,motiv,message,photo_url,instagram_url,is_featured) VALUES(:name,:sport,:position,:school,:university,:state,:season,:bio,:quote,:motiv,:message,:photo,:instagram,:featured)")->execute($row);
        }
        header("Location: /admin/index.php?section=athletes"); exit;
    }

    if ($act === 'save_temo') {
        $p = $_POST;
        $row = [
            ':name'=>trim($p['name']),':sport'=>trim($p['sport']),':quote'=>trim($p['quote']),
            ':rating'=>max(1,min(5,(int)($p['rating']??5))),':photo'=>trim($p['photo']??''),
            ':university'=>trim($p['university']??''),':season'=>trim($p['season']??''),
            ':featured'=>isset($p['featured'])?1:0
        ];
        if ($id) {
            $pdo->prepare("UPDATE testimonials SET athlete_name=:name,sport=:sport,quote=:quote,rating=:rating,photo_url=:photo,university_us=:university,season=:season,is_featured=:featured WHERE id=$id")->execute($row);
        } else {
            $pdo->prepare("INSERT INTO testimonials(athlete_name,sport,quote,rating,photo_url,university_us,season,is_featured) VALUES(:name,:sport,:quote,:rating,:photo,:university,:season,:featured)")->execute($row);
        }
        header("Location: /admin/index.php?section=temos"); exit;
    }

    if ($act === 'save_showcase') {
        $p = $_POST;
        $row = [
            ':title'=>trim($p['title']),':location'=>trim($p['location']),
            ':date'=>$p['event_date'],':desc'=>trim($p['description']??''),
            ':sports'=>trim($p['sports']??''),':capacity'=>($p['capacity']!==''?(int)$p['capacity']:null),
            ':reg_url'=>trim($p['registration_url']??''),':photo'=>trim($p['photo']??''),
            ':published'=>isset($p['published'])?1:0
        ];
        if ($id) {
            $pdo->prepare("UPDATE showcase_events SET title=:title,location=:location,event_date=:date,description=:desc,sports=:sports,capacity=:capacity,registration_url=:reg_url,photo_url=:photo,is_published=:published WHERE id=$id")->execute($row);
        } else {
            $pdo->prepare("INSERT INTO showcase_events(title,location,event_date,description,sports,capacity,registration_url,photo_url,is_published) VALUES(:title,:location,:date,:desc,:sports,:capacity,:reg_url,:photo,:published)")->execute($row);
        }
        header("Location: /admin/index.php?section=showcase"); exit;
    }

    if ($act === 'save_social') {
        $p = $_POST;
        $row = [
            ':platform'=>$p['platform'],':url'=>trim($p['post_url']),
            ':caption'=>trim($p['caption']??''),':thumb'=>trim($p['thumbnail']??''),
            ':featured'=>isset($p['featured'])?1:0
        ];
        if ($id) {
            $pdo->prepare("UPDATE social_posts SET platform=:platform,post_url=:url,caption=:caption,thumbnail_url=:thumb,is_featured=:featured WHERE id=$id")->execute($row);
        } else {
            $pdo->prepare("INSERT INTO social_posts(platform,post_url,caption,thumbnail_url,is_featured) VALUES(:platform,:url,:caption,:thumb,:featured)")->execute($row);
        }
        header("Location: /admin/index.php?section=social"); exit;
    }
}

/* ─── Load items ─── */
$editItem = null;
$items = match($section) {
    'athletes' => $pdo->query("SELECT * FROM athletes ORDER BY created_at DESC")->fetchAll(),
    'temos'    => $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll(),
    'showcase' => $pdo->query("SELECT * FROM showcase_events ORDER BY event_date DESC")->fetchAll(),
    'social'   => $pdo->query("SELECT * FROM social_posts ORDER BY created_at DESC")->fetchAll(),
    default    => []
};

if ($action === 'edit' && $id) {
    $table = match($section) {
        'athletes'=>'athletes','temos'=>'testimonials',
        'showcase'=>'showcase_events','social'=>'social_posts',default=>''
    };
    if ($table) {
        $stmt = $pdo->prepare("SELECT * FROM $table WHERE id=?");
        $stmt->execute([$id]);
        $editItem = $stmt->fetch();
    }
}

$showForm = ($action === 'add' || ($action === 'edit' && $editItem));
function v($item, $k) { return h($item[$k] ?? ''); }

$nav = [
    'athletes' => ['label'=>'Athlètes',       'icon'=>'👤'],
    'temos'    => ['label'=>'Témoignages',     'icon'=>'💬'],
    'showcase' => ['label'=>'Showcase Events', 'icon'=>'📅'],
    'social'   => ['label'=>'Réseaux sociaux', 'icon'=>'📱'],
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NextMoov Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{display:flex;min-height:100vh;font-family:'Segoe UI',sans-serif;background:#f1f5f9;color:#0f172a}
aside{width:220px;background:#00020e;display:flex;flex-direction:column;flex-shrink:0;border-right:1px solid rgba(255,255,255,.05)}
.brand{padding:1.5rem 1.25rem;border-bottom:1px solid rgba(255,255,255,.05)}
.brand-name{color:#fff;font-weight:900;letter-spacing:3px;font-size:.95rem}
.brand-sub{color:#C0A060;font-size:.65rem;letter-spacing:4px;margin-top:.15rem}
nav{flex:1;padding:.75rem .5rem}
nav a{display:flex;align-items:center;gap:.75rem;padding:.65rem .75rem;border-radius:8px;color:rgba(255,255,255,.45);font-size:.85rem;text-decoration:none;transition:all .15s;margin-bottom:2px}
nav a:hover{color:#fff;background:rgba(255,255,255,.05)}
nav a.active{background:#000769;color:#fff}
.logout{padding:.75rem .5rem;border-top:1px solid rgba(255,255,255,.05)}
.logout a{display:flex;align-items:center;gap:.75rem;padding:.65rem .75rem;border-radius:8px;color:rgba(255,255,255,.35);font-size:.85rem;text-decoration:none;transition:all .15s}
.logout a:hover{color:#fff;background:rgba(255,255,255,.05)}
main{flex:1;padding:2rem;overflow:auto}
.page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
.page-title{font-size:1.4rem;font-weight:700}
.btn{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem 1.1rem;border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;border:none;text-decoration:none;transition:all .15s}
.btn-primary{background:#000769;color:#fff}.btn-primary:hover{background:#0009c0}
.btn-danger{background:#fee2e2;color:#b91c1c}.btn-danger:hover{background:#fecaca}
.btn-edit{background:#e0e7ff;color:#3730a3}.btn-edit:hover{background:#c7d2fe}
.btn-sm{padding:.35rem .75rem;font-size:.78rem}
table{width:100%;background:#fff;border-radius:10px;border-collapse:collapse;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
th{background:#f8fafc;padding:.75rem 1rem;text-align:left;font-size:.75rem;text-transform:uppercase;letter-spacing:.5px;color:#64748b;border-bottom:1px solid #e2e8f0}
td{padding:.75rem 1rem;font-size:.88rem;border-bottom:1px solid #f1f5f9;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafbff}
.badge{display:inline-block;padding:.2rem .5rem;border-radius:4px;font-size:.72rem;font-weight:600}
.badge-on{background:#dcfce7;color:#166534}.badge-off{background:#f1f5f9;color:#64748b}
.form-card{background:#fff;border-radius:10px;padding:1.75rem;box-shadow:0 1px 4px rgba(0,0,0,.06);margin-bottom:1.5rem}
.form-title{font-size:1rem;font-weight:700;margin-bottom:1.25rem;padding-bottom:.75rem;border-bottom:1px solid #e2e8f0}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.form-grid.single{grid-template-columns:1fr}
.field{display:flex;flex-direction:column;gap:.35rem}
.field.full{grid-column:1/-1}
label{font-size:.78rem;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:.5px}
input[type=text],input[type=url],input[type=date],input[type=number],select,textarea{width:100%;padding:.6rem .85rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.88rem;outline:none;font-family:inherit;transition:border .15s}
input:focus,select:focus,textarea:focus{border-color:#000769}
textarea{resize:vertical;min-height:90px}
.check-row{display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.5rem 0}
.form-actions{display:flex;gap:.75rem;margin-top:1.25rem}
.thumb{width:36px;height:36px;border-radius:6px;object-fit:cover}
.empty{text-align:center;padding:3rem;color:#94a3b8;font-size:.9rem}
</style>
</head>
<body>

<aside>
  <div class="brand">
    <div class="brand-name">NEXT<span style="color:#B22234">MOOV</span></div>
    <div class="brand-sub">USA · ADMIN</div>
  </div>
  <nav>
    <?php foreach ($nav as $key => $item): ?>
    <a href="/admin/?section=<?= $key ?>" class="<?= $section===$key?'active':'' ?>">
      <span><?= $item['icon'] ?></span><?= $item['label'] ?>
    </a>
    <?php endforeach ?>
  </nav>
  <div class="logout"><a href="/admin/logout.php">🚪 Déconnexion</a></div>
</aside>

<main>
  <div class="page-header">
    <div class="page-title"><?= $nav[$section]['label'] ?></div>
    <?php if (!$showForm): ?>
    <a href="/admin/?section=<?= $section ?>&action=add" class="btn btn-primary">+ Ajouter</a>
    <?php endif ?>
  </div>

  <?php if ($showForm): ?>
  <!-- ─── FORMS ─── -->
  <?php if ($section === 'athletes'): ?>
  <div class="form-card">
    <div class="form-title"><?= $editItem?'Modifier l\'athlète':'Nouvel athlète' ?></div>
    <form method="POST">
      <input type="hidden" name="_action" value="save_athlete">
      <div class="form-grid">
        <div class="field"><label>Nom complet *</label><input type="text" name="name" value="<?= v($editItem,'name') ?>" required></div>
        <div class="field"><label>Sport *</label><input type="text" name="sport" value="<?= v($editItem,'sport') ?>" required></div>
        <div class="field"><label>Poste</label><input type="text" name="position" value="<?= v($editItem,'position') ?>"></div>
        <div class="field"><label>École d'origine</label><input type="text" name="school" value="<?= v($editItem,'school_origin') ?>"></div>
        <div class="field"><label>Université US</label><input type="text" name="university" value="<?= v($editItem,'university_us') ?>"></div>
        <div class="field"><label>État US</label><input type="text" name="state" value="<?= v($editItem,'state_us') ?>"></div>
        <div class="field"><label>Saison</label><input type="text" name="season" value="<?= v($editItem,'season') ?>" placeholder="ex: 2024-25"></div>
        <div class="field"><label>URL Photo</label><input type="url" name="photo" value="<?= v($editItem,'photo_url') ?>"></div>
        <div class="field"><label>Instagram URL</label><input type="url" name="instagram" value="<?= v($editItem,'instagram_url') ?>"></div>
        <div class="field full"><label>Quote (accroche)</label><input type="text" name="quote" value="<?= v($editItem,'quote') ?>"></div>
        <div class="field full"><label>Parcours / Bio</label><textarea name="bio"><?= v($editItem,'bio') ?></textarea></div>
        <div class="field full"><label>Motivation</label><textarea name="motiv"><?= v($editItem,'motiv') ?></textarea></div>
        <div class="field full"><label>Son message</label><textarea name="message"><?= v($editItem,'message') ?></textarea></div>
      </div>
      <div class="check-row"><input type="checkbox" name="featured" id="f1" <?= ($editItem['is_featured']??0)?'checked':'' ?>><label for="f1">Athlète mis en avant</label></div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <a href="/admin/?section=athletes" class="btn" style="background:#f1f5f9">Annuler</a>
      </div>
    </form>
  </div>

  <?php elseif ($section === 'temos'): ?>
  <div class="form-card">
    <div class="form-title"><?= $editItem?'Modifier le témoignage':'Nouveau témoignage' ?></div>
    <form method="POST">
      <input type="hidden" name="_action" value="save_temo">
      <div class="form-grid">
        <div class="field"><label>Nom de l'athlète *</label><input type="text" name="name" value="<?= v($editItem,'athlete_name') ?>" required></div>
        <div class="field"><label>Sport *</label><input type="text" name="sport" value="<?= v($editItem,'sport') ?>" required></div>
        <div class="field"><label>Université US</label><input type="text" name="university" value="<?= v($editItem,'university_us') ?>"></div>
        <div class="field"><label>Saison</label><input type="text" name="season" value="<?= v($editItem,'season') ?>"></div>
        <div class="field"><label>Note (1-5)</label>
          <select name="rating"><?php for($i=5;$i>=1;$i--): ?>
            <option value="<?=$i?>" <?=($editItem['rating']??5)==$i?'selected':''?>><?=$i?> étoile<?=$i>1?'s':''?></option>
          <?php endfor ?></select>
        </div>
        <div class="field"><label>URL Photo</label><input type="url" name="photo" value="<?= v($editItem,'photo_url') ?>"></div>
        <div class="field full"><label>Témoignage *</label><textarea name="quote" required><?= v($editItem,'quote') ?></textarea></div>
      </div>
      <div class="check-row"><input type="checkbox" name="featured" id="f2" <?= ($editItem['is_featured']??0)?'checked':'' ?>><label for="f2">Mis en avant</label></div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <a href="/admin/?section=temos" class="btn" style="background:#f1f5f9">Annuler</a>
      </div>
    </form>
  </div>

  <?php elseif ($section === 'showcase'): ?>
  <div class="form-card">
    <div class="form-title"><?= $editItem?'Modifier l\'événement':'Nouvel événement' ?></div>
    <form method="POST">
      <input type="hidden" name="_action" value="save_showcase">
      <div class="form-grid">
        <div class="field full"><label>Titre *</label><input type="text" name="title" value="<?= v($editItem,'title') ?>" required></div>
        <div class="field"><label>Lieu *</label><input type="text" name="location" value="<?= v($editItem,'location') ?>" required></div>
        <div class="field"><label>Date *</label><input type="date" name="event_date" value="<?= v($editItem,'event_date') ?>" required></div>
        <div class="field"><label>Capacité</label><input type="number" name="capacity" value="<?= v($editItem,'capacity') ?>" min="1"></div>
        <div class="field"><label>Sports (séparés par virgule)</label><input type="text" name="sports" value="<?= v($editItem,'sports') ?>"></div>
        <div class="field"><label>URL d'inscription</label><input type="url" name="registration_url" value="<?= v($editItem,'registration_url') ?>"></div>
        <div class="field full"><label>URL Photo</label><input type="url" name="photo" value="<?= v($editItem,'photo_url') ?>"></div>
        <div class="field full"><label>Description</label><textarea name="description"><?= v($editItem,'description') ?></textarea></div>
      </div>
      <div class="check-row"><input type="checkbox" name="published" id="f3" <?= ($editItem['is_published']??0)?'checked':'' ?>><label for="f3">Publié (visible sur le site)</label></div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <a href="/admin/?section=showcase" class="btn" style="background:#f1f5f9">Annuler</a>
      </div>
    </form>
  </div>

  <?php elseif ($section === 'social'): ?>
  <div class="form-card">
    <div class="form-title"><?= $editItem?'Modifier le post':'Nouveau post' ?></div>
    <form method="POST">
      <input type="hidden" name="_action" value="save_social">
      <div class="form-grid">
        <div class="field"><label>Plateforme *</label>
          <select name="platform">
            <?php foreach(['instagram','tiktok','youtube','twitter'] as $p): ?>
            <option value="<?=$p?>" <?=($editItem['platform']??'')===$p?'selected':''?>><?=ucfirst($p)?></option>
            <?php endforeach ?>
          </select>
        </div>
        <div class="field"><label>URL du post *</label><input type="url" name="post_url" value="<?= v($editItem,'post_url') ?>" required></div>
        <div class="field full"><label>URL Miniature</label><input type="url" name="thumbnail" value="<?= v($editItem,'thumbnail_url') ?>"></div>
        <div class="field full"><label>Légende</label><textarea name="caption"><?= v($editItem,'caption') ?></textarea></div>
      </div>
      <div class="check-row"><input type="checkbox" name="featured" id="f4" <?= ($editItem['is_featured']??0)?'checked':'' ?>><label for="f4">Mis en avant</label></div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <a href="/admin/?section=social" class="btn" style="background:#f1f5f9">Annuler</a>
      </div>
    </form>
  </div>
  <?php endif ?>

  <?php else: ?>
  <!-- ─── TABLES ─── -->
  <?php if (!$items): ?>
    <div class="empty">Aucun élément. Cliquez sur <strong>+ Ajouter</strong> pour commencer.</div>
  <?php elseif ($section === 'athletes'): ?>
  <table>
    <tr><th>Photo</th><th>Nom</th><th>Sport</th><th>Université US</th><th>Mis en avant</th><th>Actions</th></tr>
    <?php foreach($items as $row): ?>
    <tr>
      <td><?= $row['photo_url']?"<img class='thumb' src='".h($row['photo_url'])."' loading='lazy'>":"—" ?></td>
      <td><strong><?= h($row['name']) ?></strong></td>
      <td><?= h($row['sport']) ?></td>
      <td><?= h($row['university_us']) ?><?= $row['state_us']?' · '.h($row['state_us']):'' ?></td>
      <td><span class="badge <?= $row['is_featured']?'badge-on':'badge-off' ?>"><?= $row['is_featured']?'Oui':'Non' ?></span></td>
      <td style="white-space:nowrap">
        <a href="/admin/?section=athletes&action=edit&id=<?= $row['id'] ?>" class="btn btn-edit btn-sm">Modifier</a>
        <form method="POST" style="display:inline" onsubmit="return confirm('Supprimer ?')">
          <input type="hidden" name="_action" value="delete">
          <input type="hidden" name="_section" value="athletes">
          <input type="hidden" name="id" value="<?= $row['id'] ?>">
          <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
        </form>
      </td>
    </tr>
    <?php endforeach ?>
  </table>

  <?php elseif ($section === 'temos'): ?>
  <table>
    <tr><th>Photo</th><th>Athlète</th><th>Sport</th><th>Université</th><th>Note</th><th>Actions</th></tr>
    <?php foreach($items as $row): ?>
    <tr>
      <td><?= $row['photo_url']?"<img class='thumb' src='".h($row['photo_url'])."' loading='lazy'>":"—" ?></td>
      <td><strong><?= h($row['athlete_name']) ?></strong></td>
      <td><?= h($row['sport']) ?></td>
      <td><?= h($row['university_us']) ?></td>
      <td><?= str_repeat('★',$row['rating']).str_repeat('☆',5-$row['rating']) ?></td>
      <td style="white-space:nowrap">
        <a href="/admin/?section=temos&action=edit&id=<?= $row['id'] ?>" class="btn btn-edit btn-sm">Modifier</a>
        <form method="POST" style="display:inline" onsubmit="return confirm('Supprimer ?')">
          <input type="hidden" name="_action" value="delete">
          <input type="hidden" name="_section" value="temos">
          <input type="hidden" name="id" value="<?= $row['id'] ?>">
          <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
        </form>
      </td>
    </tr>
    <?php endforeach ?>
  </table>

  <?php elseif ($section === 'showcase'): ?>
  <table>
    <tr><th>Titre</th><th>Lieu</th><th>Date</th><th>Publié</th><th>Actions</th></tr>
    <?php foreach($items as $row): ?>
    <tr>
      <td><strong><?= h($row['title']) ?></strong></td>
      <td><?= h($row['location']) ?></td>
      <td><?= h($row['event_date']) ?></td>
      <td><span class="badge <?= $row['is_published']?'badge-on':'badge-off' ?>"><?= $row['is_published']?'Publié':'Brouillon' ?></span></td>
      <td style="white-space:nowrap">
        <a href="/admin/?section=showcase&action=edit&id=<?= $row['id'] ?>" class="btn btn-edit btn-sm">Modifier</a>
        <form method="POST" style="display:inline" onsubmit="return confirm('Supprimer ?')">
          <input type="hidden" name="_action" value="delete">
          <input type="hidden" name="_section" value="showcase">
          <input type="hidden" name="id" value="<?= $row['id'] ?>">
          <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
        </form>
      </td>
    </tr>
    <?php endforeach ?>
  </table>

  <?php elseif ($section === 'social'): ?>
  <table>
    <tr><th>Plateforme</th><th>Miniature</th><th>Légende</th><th>Mis en avant</th><th>Actions</th></tr>
    <?php foreach($items as $row): ?>
    <tr>
      <td><strong><?= ucfirst(h($row['platform'])) ?></strong></td>
      <td><?= $row['thumbnail_url']?"<img class='thumb' src='".h($row['thumbnail_url'])."' loading='lazy'>":"—" ?></td>
      <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><?= h($row['caption']) ?></td>
      <td><span class="badge <?= $row['is_featured']?'badge-on':'badge-off' ?>"><?= $row['is_featured']?'Oui':'Non' ?></span></td>
      <td style="white-space:nowrap">
        <a href="/admin/?section=social&action=edit&id=<?= $row['id'] ?>" class="btn btn-edit btn-sm">Modifier</a>
        <form method="POST" style="display:inline" onsubmit="return confirm('Supprimer ?')">
          <input type="hidden" name="_action" value="delete">
          <input type="hidden" name="_section" value="social">
          <input type="hidden" name="id" value="<?= $row['id'] ?>">
          <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
        </form>
      </td>
    </tr>
    <?php endforeach ?>
  </table>
  <?php endif ?>
  <?php endif ?>
</main>

</body>
</html>
