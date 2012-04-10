<h2>Register</h2>

<form action="" method="post" charset="utf8">
    <p>
        <label for="name">Name</label>
        <br>
        <input type="text" value="<?php echo $this->input->post('name'); ?>" name="name" id="name" class="text large required">
    </p>
    <p>
        <label for="username">Username</label>
        <br>
        <input type="text" value="<?php echo $this->input->post('username'); ?>" name="username" id="username" class="text large required">
        <br>
        <sup>* You can use your email as your username.</sup>
    </p>
    <p>
        <label for="password">Password</label>
        <br>
        <input type="password" value="<?php echo $this->input->post('password'); ?>" name="password" id="password" class="text large required">
    </p>
    <p>
        <label for="email">Email</label>
        <br>
        <input type="text" value="<?php echo $this->input->post('email'); ?>" name="email" id="email" class="text large required">
    </p>
    <p>
        <input type="submit" value="Register" id="register" class="submit">
    </p>
</form>
