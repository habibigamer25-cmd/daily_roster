<?php
// save.php — receives the parsed roster data from admin.html and saves it
// to roster_data.json, which index.html (the public page) reads from.

header('Content-Type: application/json');

// ============================================================
// SET YOUR PASSWORD HERE — change this before uploading to your server
// ============================================================
$ADMIN_PASSWORD = 'aidriver';
// ============================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$password = isset($_POST['password']) ? $_POST['password'] : '';
$data = isset($_POST['data']) ? $_POST['data'] : '';

if (!hash_equals($ADMIN_PASSWORD, $password)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Incorrect password.']);
    exit;
}

$decoded = json_decode($data, true);
if ($decoded === null || !isset($decoded['employees'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid roster data received.']);
    exit;
}

$targetFile = __DIR__ . '/roster_data.json';
$result = file_put_contents($targetFile, $data);

if ($result === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not save the file on the server. Make sure this folder is writable (permissions 755 or 775, and roster_data.json is 664).'
    ]);
    exit;
}

echo json_encode(['success' => true]);
