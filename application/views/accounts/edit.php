	<div id="body">
        <h2>Edit <?php echo $account->name; ?></h2>

        <form action="" method="post" charset="utf8">
            <p>
                <label for="name">Account Name</label>
                <input type="text" value="<?php echo $account->name; ?>" name="name" id="name">
            </p>
            <p>
                <label for="description">Description</label>
                <input type="text" value="<?php echo $account->description; ?>" name="description" id="description">
            </p>
            <p>
                <label for="amount">Amount</label>
                <input type="amount" value="<?php echo $account->amount; ?>" name="amount" id="amount">
            </p>
            <p>
                <label for="default">Default</label>
                <?php echo form_checkbox('default', 'default', (bool) $account->default); ?>
            </p>
            <p>
                <input type="submit" value="Save" id="save">
            </p>
        </form>

	</div>

