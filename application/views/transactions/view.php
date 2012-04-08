	<div id="body">
        <h2><?php echo $account->name; ?> (<a href="/transactions/add/<?php echo $account->slug; ?>">add</a>)</h2>
        <ul>
        <?php foreach ($transactions as $t) { ?>
            <li><?php echo $t->amount.' '.$t->description; ?> (<a href="/transactions/edit/<?php echo $account->slug.'/'.$t->transaction_id; ?>">edit</a>) (<a href="/transactions/delete/<?php echo $account->slug.'/'.$t->transaction_id; ?>">delete</a>)</li>
        <?php } ?>
        </ul>
	</div>
