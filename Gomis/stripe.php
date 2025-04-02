<?php
require_once('../vendor/autoload.php');
$clefs_secrete = 'sk_test_51QRFnfBbPekJvLtQCBfXkISYtJhn4zlvpdQOP2kS0Zj52XpkpyuETXRXHqdmTmn8o1vSQQz5JThI6OJY088YeMQD00MLTEfF5B';

\Stripe\Stripe::setApiKey($clefs_secrete);
$stripe = new \Stripe\StripeClient($clefs_secrete);

?>
