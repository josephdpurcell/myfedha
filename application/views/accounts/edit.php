	<div id="body">
        <h2>Edit <?php echo $account->name; ?></h2>

        <form action="" method="post" charset="utf8">
            <p>
                <label for="name">Account Name</label>
                <br>
                <input type="text" value="<?php echo $account->name; ?>" name="name" id="name" class="text large required">
            </p>
            <p>
                <label for="description">Description</label>
                <br>
                <input type="text" value="<?php echo $account->description; ?>" name="description" id="description" class="text large required">
            </p>
            <p>
                <label for="amount">Amount</label>
                <br>
                <input type="amount" value="<?php echo $account->amount; ?>" name="amount" id="amount" class="text large required">
            </p>
            <p>
                <label for="types">Type</label>
                <br>
                <?php echo form_dropdown('type',$types,$account->type,'class="select required"'); ?>
            </p>
            <p>
                <label for="default">Default</label>
                <?php echo form_checkbox('default', 'default', (bool) $account->default); ?>
            </p>
            <p>
                <input type="submit" value="Save" id="save" class="submit">
            </p>
        </form>

	</div>

