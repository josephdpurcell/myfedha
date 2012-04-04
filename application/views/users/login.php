<h2>Login</h2>

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
        <label for="password">Password</label>
        <input type="password" value="<?php echo $this->input->post('password'); ?>" name="password" id="password">
    </p>
    <p>
        <input type="submit" value="Login" id="login">
    </p>
    <p>
        <a href="/users/reset_password">Lost Password?</a>
    </p>
</form>
