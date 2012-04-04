<h2>Reset Password</h2>

If you forgot your password, you can reset it here.

<?php if (isset($error)) { ?>
    <div id="message">
        <?php echo $error; ?>
    </div>
<?php } ?>

<form action="" method="post" charset="utf8">
    <p>
        <label for="username">Username</label>
        <input type="text" value="<?php echo $this->input->post('username'); ?>" name="username" id="username">
    </p>
    <p>
        <label for="email">Email</label>
        <input type="text" value="<?php echo $this->input->post('email'); ?>" name="email" id="email">
    </p>
    <p>
        <input type="submit" value="Reset Password" id="reset-password">
    </p>
</form>
