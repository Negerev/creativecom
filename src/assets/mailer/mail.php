<?php


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Exception.php';
require 'PHPMailer.php';

$admin_mail = "dim@creativecom.org";
$admin_mail2 = "evn@creativecom.org";

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);
//From email address and name
$mail->CharSet = 'utf-8';
$mail->From = "info@creativecom.org";
$mail->FromName = "Message from Creativecom.org";
//To address and name

$mail->addAddress($admin_mail);
$mail->addAddress($admin_mail2);

//Send HTML or Plain Text email
$mail->isHTML(true);

$mail->Subject = "Message from Feedbackform";
$mail->Body = '
<p><i>Name</i> : <b>'.$_POST["fb_name"].'</b></p>
<p><i>Phone number</i> : <b>'.$_POST["fb_phone"].'</b></p>
<p><i>E-mail</i> : <b>'.$_POST["fb_email"].'</b></p>
<p><i>Message</i> : <b>'.$_POST["fb_message"].'</b></p>
<br/>
<sub>Send : '.date("d-m-Y H:i:s").'</sub>';
$mail->AltBody = 'Name : '.$_POST["fb_name"].' | Phone number : '.$_POST["fb_phone"].' | E-mail : '.$_POST["fb_email"].' | Message : '.$_POST["fb_message"].' | ';

try {
    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}