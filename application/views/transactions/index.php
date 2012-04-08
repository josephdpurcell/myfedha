	<div id="body">
        <h2><?php echo $account->name; ?></h2>
        <ul>
        <?php foreach ($transactions as $t) { ?>
            <li><?php echo $t['amount'].' '.$t['description']; ?></li>
        <?php } ?>
        </ul>
	</div>
