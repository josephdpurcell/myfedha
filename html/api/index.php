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
 * BudgetTransaction Model
 */
class BudgetTransaction extends \Illuminate\Database\Eloquent\Model
{
}

/**
 * Account Model
 */
class Account extends \Illuminate\Database\Eloquent\Model
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
        if ($this->app->request->isOptions()) {
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
            header( 'HTTP/1.1 200 OK' );
            exit();
        }
        // allow request to /authenticate
        if (!$this->app->request->isPost() || $this->app->request->getResourceUri()!='/authenticate') {
            // no auth header
            try {
                $authHeader = $this->app->request->headers->get('HTTP_AUTHORIZATION');
                if (!$authHeader) {
                    var_dump($authHeader);
                    var_dump($this->app->request->headers->all());

                    throw new \Exception('No Authentication Header Set', 401);
                } else {
                    // The 6th character should be a space.
                    if (substr($authHeader, 5, 1)!==' ') {
                        throw new \Exception('Invalid Authentication Realm', 400);
                    }
                    // The chars 0-5 should be OAuth.
                    $realm = strtolower(substr($authHeader, 0, 5));
                    if ($realm != 'oauth') {
                        throw new \Exception('Invalid Authentication Realm: '.$realm, 400);
                    }
                    // The chars 7+ should be the access_token.
                    $access_token = substr($authHeader, 6);
                    if (!$access_token) {
                        throw new \Exception('No Access Token Sent', 400);
                    }
                    $user = User::where('access_token', $access_token)->first();
                    if (!$user) {
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

$app->notFound(function () use ($app) {
    $error = array(
        'title' => 'Not Found',
        'type' => 'http =>//httpstatus.es/404',
        'status' => 404,
        'detail' => 'No route found for "'.$app->request->getMethod().' '.$app->request->getResourceUri().'"'
    );
    echo json_encode($error);
});

$app->post('/authenticate', function () use ($app) {
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

$app->get('/users/:id', function ($id) use ($app) {
    if ($id==$app->user->id) {
        echo $app->user->toJson();
    } else {
        throw new \Exception('Invalid user id sent');
    }
});

$app->get('/transaction', function () use ($app) {
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

$app->post('/transaction', function () use ($app) {
    $body = $app->request->getBody();
    $data = json_decode($body);
    $t = new Transaction;
    $t->amount = $data->amount;
    $t->description = $data->description;
    $t->date = $data->date;
    $t->save();
    echo $t->toJson();
});

$app->put('/transaction/:id', function ($id) use ($app) {
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

$app->get('/budget', function () use ($app) {
    $req = $app->request();
    $start = $req->get('start');
    $end = $req->get('end');
    if ($start && $end) {
        $from = date( 'Y-m-d G:i:s', $start);
        $to = date( 'Y-m-d G:i:s', $end);
        $budgets = BudgetTransaction::orderBy('date', 'ASC')->whereBetween('date', array($from, $to))->get();
    } elseif ($start) {
        $from = date( 'Y-m-d G:i:s', $start);
        $budgets = BudgetTransaction::orderBy('date', 'ASC')->where('date', '>=', $from)->get();
    } elseif ($end) {
        $to = date( 'Y-m-d G:i:s', $end);
        $budgets = BudgetTransaction::orderBy('date', 'ASC')->where('date', '<=', $to)->get();
    } else {
        $budgets = BudgetTransaction::orderBy('date', 'ASC')->get();
    }
    echo $budgets->toJson();
});

$app->get('/budget/:id', function ($id) {
    $t = BudgetTransaction::find($id);
    echo $t->toJson();
});

$app->post('/budget', function () use ($app) {
    $body = $app->request->getBody();
    $data = json_decode($body);
    $t = new BudgetTransaction;
    $t->estimate = $data->estimate;
    $t->amount = $data->amount;
    $t->account_id = $data->account_id;
    $t->type = $data->type;
    $t->description = $data->description;
    $t->date = $data->date;
    $t->save();
    echo $t->toJson();
});

$app->put('/budget/:id', function ($id) use ($app) {
    $t = BudgetTransaction::find($id);

    $body = $app->request->getBody();
    $data = json_decode($body);

    $t->estimate = $data->estimate;
    $t->amount = $data->amount;
    $t->account_id = $data->account_id;
    $t->type = $data->type;
    $t->description = $data->description;
    $t->date = $data->date;
    $t->save();
    echo $t->toJson();
});

$app->delete('/budget/:id', function ($id) {
    $t = BudgetTransaction::find($id);
    $t->delete();
    echo $t->toJson();
});

$app->get('/account', function () use ($app) {
    $req = $app->request();
    $start = $req->get('start');
    $end = $req->get('end');
    $accounts = Account::orderBy('description', 'ASC')->get();
    echo $accounts->toJson();
});

$app->get('/account/:id', function ($id) {
    $t = Account::find($id);
    echo $t->toJson();
});

$app->post('/account', function () use ($app) {
    $body = $app->request->getBody();
    $data = json_decode($body);
    $t = new Account;
    $t->amount = $data->amount;
    $t->description = $data->description;
    $t->save();
    echo $t->toJson();
});

$app->put('/account/:id', function ($id) use ($app) {
    $t = Account::find($id);

    $body = $app->request->getBody();
    $data = json_decode($body);

    $t->amount = $data->amount;
    $t->description = $data->description;
    $t->save();
    echo $t->toJson();
});

$app->delete('/account/:id', function ($id) {
    $t = Account::find($id);
    $t->delete();
    echo $t->toJson();
});

$app->run();

