<?php if (isset($error)) { ?>
    <div id="message">
        <?php echo $error; ?>
    </div>
<?php } ?>

<form action="" method="post" charset="utf8" id="loginform">
    <p>
        <label for="username">Username</label>
        <input type="text" value="<?php echo $this->input->post('username'); ?>" name="username" id="username" class="text large required">
    </p>
    <p>
        <label for="password">Password</label>
        <input type="password" value="<?php echo $this->input->post('password'); ?>" name="password" id="password" class="text large required">
    </p>
    <p>
        <input type="submit" value="Login" id="login" class="submit">
        <a href="/users/reset_password">Lost Password?</a>
    </p>
    <p style="text-align:center">
        <a href="/pages/about">About</a> |
        <a href="/pages/tos">ToS</a> |
        <a href="/pages/privacy_policy">Privacy Policy</a>
    </p>
</form>
