	<div id="body">
        <h2>Add Transaction on <?php echo $account->name; ?></h2>

        <form action="" method="post" charset="utf8">
            <p>
                <label for="date">Date</label>
                <br>
                <input type="text" value="<?php echo $this->input->post('date'); ?>" name="date" id="date" class="text large required">
            </p>
            <p>
                <label for="amount">Amount</label>
                <br>
                <input type="amount" value="<?php echo $this->input->post('amount'); ?>" name="amount" id="amount" class="text large required">
            </p>
            <p>
                <label for="description">Description</label>
                <br>
                <input type="text" value="<?php echo $this->input->post('description'); ?>" name="description" id="description" class="text large">
            </p>
            <p>
                <label for="tags">Tags</label>
                <br>
                <input type="text" value="<?php echo $this->input->post('tags'); ?>" name="tags" id="tags" class="text large required">
            </p>
            <p>
                <input type="submit" value="Save" id="save" class="submit">
            </p>
        </form>

	</div>

