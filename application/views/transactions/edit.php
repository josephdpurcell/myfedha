	<div id="body">
        <h2>Edit Transaction on <?php echo $account->name; ?></h2>

        <form action="" method="post" charset="utf8">
            <p>
                <label for="date">Date</label>
                <input type="text" value="<?php echo $transaction->date; ?>" name="date" id="date">
            </p>
            <p>
                <label for="amount">Amount</label>
                <input type="amount" value="<?php echo $transaction->amount; ?>" name="amount" id="amount">
            </p>
            <p>
                <label for="description">Description</label>
                <input type="text" value="<?php echo $transaction->description; ?>" name="description" id="description">
            </p>
            <p>
                <label for="tags">Tags</label>
                <input type="text" value="<?php echo $transaction->tags; ?>" name="tags" id="tags">
            </p>
            <p>
                <input type="submit" value="Save" id="save">
            </p>
        </form>

	</div>

