<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Budget</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="styles/main.css">
  </head>

  <?
  var_dump($_POST);
  ?>

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
