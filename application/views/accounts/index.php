	<div id="body">
        <h2>Accounts</h2>
        <ul>
        <?php foreach ($accounts as $a) { ?>
            <li>$<?php echo $a->amount; ?> - <?php echo $a->name; ?> (<a href="/accounts/edit/<?php echo $a->account_id; ?>">edit</a>)</li>
        <?php } ?>
        </ul>
        <h2>Actions</h2>
        <ul>
            <li><a href="/accounts/add">Add</a></li>
        </ul>
	</div>

