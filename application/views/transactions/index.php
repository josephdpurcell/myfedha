	<div id="body">
        <h2><?php echo $account->name; ?></h2>

        <form method="post" action="/transactions/add/<?php echo $account->slug; ?>">
        <input name="add" type="submit" class="submit" value="Add">
        </form>

        <table width="100%" border="0" cellpadding="0" cellspacing="0">
            
            <tr>
            
                <th width="5%" scope="col">
                <input type="checkbox" name="checkbox" id="checkbox" class="checkall" /><label for="checkbox"></label></th>
                
                <th width="18%" scope="col">Date</th>
                <th width="16%" scope="col">Amount</th>
                <th width="29%" scope="col">Description</th>
                <th width="13%" scope="col">Tags</th>
                <th width="11%" scope="col">Status</th>
                <th width="8%" scope="col">Action</th>
            </tr>

            <?php foreach ($transactions as $t) { ?>
            <tr>
                <td scope="col"><input type="checkbox" name="checkbox2" id="checkbox2" /></td>
                <td scope="col"><?php echo date("n/j/y",strtotime($t->date)); ?> </td>
                <td scope="col"><?php echo $t->amount; ?> </td>
                <td scope="col"><?php echo $t->description; ?> </td>
                <td scope="col"><?php echo $t->tags; ?> </td>
                <td scope="col"><?php echo $t->status; ?> </td>
                <td scope="col">
                    <a href="/transactions/delete/<?php echo $account->slug; ?>/<?php echo $t->transaction_id; ?>"><img src="/images/icondock/delete.png" alt="Delete" width="16" height="16"></a>
                    <a href="/transactions/edit/<?php echo $account->slug; ?>/<?php echo $t->transaction_id; ?>"><img src="/images/icondock/16x16/to_do_list.png" alt="Edit" width="16" height="16"></a>
                </td>
            </tr>
            <?php } ?>

        </table>

	</div>
