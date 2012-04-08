	<div id="body">
        <h2>Add Account</h2>

        <form action="" method="post" charset="utf8">
            <p>
                <label for="name">Account Name</label>
                <input type="text" value="<?php echo $this->input->post('name'); ?>" name="name" id="name">
            </p>
            <p>
                <label for="description">Description</label>
                <input type="text" value="<?php echo $this->input->post('description'); ?>" name="description" id="description">
            </p>
            <p>
                <label for="amount">Amount</label>
                <input type="amount" value="<?php echo $this->input->post('amount'); ?>" name="amount" id="amount">
            </p>
            <p>
                <label for="default">Default</label>
                <?php echo form_checkbox('default', 'default', (bool) $this->input->post('default')); ?>
            </p>
            <p>
                <input type="submit" value="Create" id="create">
            </p>
        </form>

	</div>

