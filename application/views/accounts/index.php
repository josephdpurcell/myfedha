	<div id="body">
        <h2>Accounts</h2>
        <ul>
        <?php foreach ($accounts as $a) { ?>
            <li>$<?php echo $a->amount; ?> - <?php echo $a->name; ?> (<a href="/accounts/edit/<?php echo $a->account_id; ?>">edit</a>)</li>
        <?php } ?>
        </ul>

        <form method="post" action="/accounts/add">
        <input name="add" type="submit" class="submit" value="Add">
        </form>
	</div>

