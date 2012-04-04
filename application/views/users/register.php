<h2>Register</h2>

<?php if (isset($error)) { ?>
    <div id="message">
        <?php echo $error; ?>
    </div>
<?php } ?>

<form action="" method="post" charset="utf8">
    <p>
        <label for="name">Name</label>
        <input type="text" value="<?php echo $this->input->post('name'); ?>" name="name" id="name">
    </p>
    <p>
        <label for="username">Username</label>
        <input type="text" value="<?php echo $this->input->post('username'); ?>" name="username" id="username">
        <br>
        <sup>* You can use your email as your username.</sup>
    </p>
    <p>
        <label for="password">Password</label>
        <input type="password" value="<?php echo $this->input->post('password'); ?>" name="password" id="password">
    </p>
    <p>
        <label for="email">Email</label>
        <input type="text" value="<?php echo $this->input->post('email'); ?>" name="email" id="email">
    </p>
    <p>
        <input type="submit" value="Register" id="register">
    </p>
</form>
