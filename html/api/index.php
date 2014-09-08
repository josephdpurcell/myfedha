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


$app = new \Slim\Slim(array(
    'debug' => true
));

$app->response->headers->set('Content-Type', 'application/json');

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

