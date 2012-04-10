<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Login | MyFedha</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
    <script src="/js/jquery.validate.js"></script>
    <script src="/js/login.js"></script>
    <link href="/css/theme-style.css" rel="stylesheet" type="text/css">
    <link href="/css/myfedha-style.css" rel="stylesheet" type="text/css">
</head>
<body>

<div id="admin_wrapper">

    <h1>Login</h1>

    <?php if ($this->session->flashdata('error')) { ?>
    <div id="error">
        <?php echo $this->session->flashdata('error'); ?>
    </div>
    <?php } ?>
    <?php if ($this->session->flashdata('notice')) { ?>
    <div id="notice">
        <?php echo $this->session->flashdata('notice'); ?>
    </div>
    <?php } ?>

