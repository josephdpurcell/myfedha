<h2>Change Password</h2>

<?php if (isset($error)) { ?>
    <div id="message">
        <?php echo $error; ?>
    </div>
<?php } ?>

<form action="" method="post" charset="utf8">
    <p>
        <label for="password">Password</label>
        <br>
        <input type="password" value="<?php echo $this->input->post('password'); ?>" name="password" id="password" class="text large required">
    </p>
    <p>
        <label for="password_again">Password Again</label>
        <br>
        <input type="password" value="<?php echo $this->input->post('password_again'); ?>" name="password_again" id="password_again" class="text large required">
    </p>
    <p>
        <input type="submit" value="Change Password" id="change-password" class="submit">
    </p>
</form>
