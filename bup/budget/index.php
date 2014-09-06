<?


$con = mysqli_connect('localhost', 'myfedha_trials', 'oamEkavCocPobNepIkDib0phravcarv+', 'myfedha_trials');
if (!$con) {
  error_log('Could not connect: ' . mysqli_error($con));
  echo '<!DOCTYPE html><html><head></head><body><h1>Sorry, the database is currently unavailable.</h1></body></html>';
  exit;
}

var_dump($result);

?><!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Budget</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="styles/main.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
<script type="text/javascript">
Stripe.setPublishableKey('pk_test_YbuiIZVoBsbGiW6SkfeUx1sF');
var stripeResponseHandler = function(status, response) {
  console.log(response);
  var $form = $('#payment-form');
  if (response.error) {
    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);
  } else {
    // token contains id, last4, and card type
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and re-submit
    $form.get(0).submit();
  }
};
jQuery(function($) {
  $('#payment-form').submit(function(e) {
    var $form = $(this);
    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken($form, stripeResponseHandler);
    // Prevent the form from submitting with the default action
    return false;
  });
});
</script>
  </head>
  <body ng-app="fedhaApp">
    <div class="container" ng-view=""></div>


    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js"></script>
    <script src="bower_components/angular-resource/angular-resource.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="bower_components/angular-route/angular-route.js"></script>

    <script src="scripts/app.js"></script>
    <script src="scripts/controllers/main.js"></script>
</body>
</html>
