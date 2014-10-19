<?php
namespace Api;

require 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection(array(
    'driver'    => 'mysql',
    'host'      => 'localhost',
    'database'  => 'myfedha_2014',
    'username'  => 'root',
    'password'  => 'Isaiah40:4',
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
));

// Set the event dispatcher used by Eloquent models... (optional)
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
$capsule->setEventDispatcher(new Dispatcher(new Container));
// Make this Capsule instance available globally via static methods... (optional)
$capsule->setAsGlobal();
// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
$capsule->bootEloquent();

/**
 * Transaction Model
 */
class Transaction extends \Illuminate\Database\Eloquent\Model
{
}

/**
 * User Model
 */
class User extends \Illuminate\Database\Eloquent\Model
{
}

class OAuth2Auth extends \Slim\Middleware
{
    protected $headers = array();

    public function __construct($headers) {
        $this->headers = $headers;
    }

    public function call() {
        // allow request to /authenticate
        if (!$this->app->request->isPost() || $this->app->request->getResourceUri()!='/authenticate') {
            // no auth header
            try {
                if (!isset($this->headers['Authorization'])) {
                    throw new \Exception('No Authentication Header Set', 401);
                } else {
                    $authHeader = $this->headers['Authorization'];
                    $authHeader = strtolower($authHeader);
                    $authHeaderParts = split(' ', $authHeader);
                    $realm = $authHeaderParts[0];
                    if ($realm != 'oauth') {
                        throw new \Exception('Invalid Authentication Realm: '.$realm, 400);
                    }
                    $access_token = isset($authHeaderParts[1]) ? $authHeaderParts[1] : null;
                    if (empty($access_token)) {
                        throw new \Exception('No Access Token Sent', 400);
                    }
                    $user = User::where('access_token', $access_token)->first();
                    if (empty($user)) {
                        throw new \Exception('Invalid Access Token', 403);
                    }
                    $this->app->user = $user;
                }
            } catch (\Exception $e) {
                $this->app->error($e);
                exit;
            }
        }
        // this line is required for the application to proceed
        $this->next->call();
    }
}

$app = new \Slim\Slim(array(
    'debug' => false
));

$app->response->headers->set('Content-Type', 'application/json');

$app->error(function($e) use ($app) {
    header((string) $e->getMessage(), true, (int) $e->getCode());
    echo json_encode(array(
        'error' => $e->getCode(),
        'message' => $e->getMessage()
    ));
    exit;
});

$headers = apache_request_headers();
$app->add(new OAuth2Auth($headers));

$app->post('/authenticate', function () {
    global $app;
    $body = $app->request->getBody();
    $data = json_decode($body);
    if (empty($data->username)) {
        throw new \Exception('No Username Sent', 401);
    } elseif (empty($data->password)) {
        throw new \Exception('No Password Sent', 401);
    }
    $username = $data->username;
    $password = hash_hmac('sha256', $data->password, 'cryhynInGheelj5!DrodIlgevheigodd');
    $user = User::where('username', $username)->where('password', $password)->first();
    if (empty($user)) {
        throw new \Exception('Incorrect Username or Password', 401);
    }
    if (empty($user->access_token)) {
        $user->access_token = bin2hex(openssl_random_pseudo_bytes(16));
    }
    $user->save();
    echo $user->toJson();
});

$app->get('/users/:id', function ($id) {
    global $app;
    if ($id==$app->user->id) {
        echo $app->user->toJson();
    } else {
        throw new \Exception('Invalid user id sent');
    }
});

$app->get('/transaction', function () {
    global $app;
    $req = $app->request();
    $start = $req->get('start');
    $end = $req->get('end');
    if ($start && $end) {
        $from = date( 'Y-m-d G:i:s', $start);
        $to = date( 'Y-m-d G:i:s', $end);
        $transactions = Transaction::orderBy('date', 'ASC')->whereBetween('date', array($from, $to))->get();
    } elseif ($start) {
        $from = date( 'Y-m-d G:i:s', $start);
        $transactions = Transaction::orderBy('date', 'ASC')->where('date', '>=', $from)->get();
    } elseif ($end) {
        $to = date( 'Y-m-d G:i:s', $end);
        $transactions = Transaction::orderBy('date', 'ASC')->where('date', '<=', $to)->get();
    } else {
        $transactions = Transaction::orderBy('date', 'ASC')->get();
    }
    echo $transactions->toJson();
});

$app->get('/transaction/:id', function ($id) {
    $t = Transaction::find($id);
    echo $t->toJson();
});

$app->post('/transaction', function () {
    global $app;
    $body = $app->request->getBody();
    $data = json_decode($body);
    $t = new Transaction;
    $t->amount = $data->amount;
    $t->description = $data->description;
    $t->date = $data->date;
    $t->save();
    echo $t->toJson();
});

$app->put('/transaction/:id', function ($id) {
    global $app;
    $t = Transaction::find($id);

    $body = $app->request->getBody();
    $data = json_decode($body);

    $t->amount = $data->amount;
    $t->description = $data->description;
    $t->date = $data->date;
    $t->save();
    echo $t->toJson();
});

$app->delete('/transaction/:id', function ($id) {
    $t = Transaction::find($id);
    $t->delete();
    echo $t->toJson();
});

$app->run();

