<h2>Confirm</h2>

<?php if (isset($error)) { ?>
    <div id="message">
        <?php echo $error; ?>
    </div>
<?php } ?>

<form action="" method="get" charset="utf8">
    <p>
        <label for="name">Please enter the confirmation code you received in your email:</label>
        <input type="text" value="<?php echo $this->input->post('confirmation_code'); ?>" name="confirmation_code" id="confirmation_code">
    </p>
    <p>
        <input type="submit" value="Confirm" id="confirm">
    </p>
    <p>
        <a href="/users/confirm_resend">Click here to resend the confirmation code.</a>
    </p>
</form>
