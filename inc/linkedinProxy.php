<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$token = getenv('LINKEDIN_ACCESS_TOKEN');
if (!$token) {
    http_response_code(500);
    echo json_encode(['error' => 'Access token not configured']);
    exit;
}

$url = 'https://api.linkedin.com/v2/recommendations?q=received&start=0&count=5&projection=(elements*(recommendationText,recommender~(firstName,lastName,profilePicture(displayImage~:playableStreams))))';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'X-Restli-Protocol-Version: 2.0.0'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$error = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => $error]);
    exit;
}

http_response_code($code);
if ($response) {
    echo $response;
} else {
    echo json_encode(['error' => 'No response from LinkedIn']);
}
