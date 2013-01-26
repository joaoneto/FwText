<?php
/**
 * FwText plugin
 * Copyright (c) 2013 João Pinto Neto
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
header('Content-type: application/json');

if (isset($_FILES)) {
    $uploadDir = isset($_POST['uploadDir']) ? realpath($_POST['uploadDir']) : realpath('.');
    $error = array();
    $filesUploaded = array();

    foreach ($_FILES as $file) {
        $fileName = strip_tags($file['name']);
        if (empty($fileName)) {
            continue;
        }
        
        $uploadedFile = $file['tmp_name'];
        $destination = $uploadDir . DIRECTORY_SEPARATOR . $fileName;

        try {
            if ($file['error']) {
                throw new Exception($file['error']);
            }
            
            if (!is_uploaded_file($uploadedFile)) {
                throw new Exception("Error uploading {$fileName}");
            }

            if (!move_uploaded_file($uploadedFile, $destination)) {
                throw new Exception("Error moving {$fileName} to {$destination}");
            }
            $filesUploaded[] = $fileName;
        } catch (Exception $e) {
            $error = $e->getMessage();
            break;
        }
    }

    $result = new stdClass;
    if (!empty($error)) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        $result->success = false;
        $result->msg = $error;
        $result->files = null;
        echo json_encode($result);
    } else {
        $result->success = true;
        $result->msg = empty($filesUploaded) ? 'No file sent' : 'File(s) uploaded';
        $result->files = empty($filesUploaded) ? null : $filesUploaded;
        echo json_encode($result);
    }
}