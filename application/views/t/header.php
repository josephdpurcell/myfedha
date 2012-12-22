<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>MyFedha - Double entry done right.</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
    <script src="/js/jquery.validate.js"></script>
<!--
    <script type="text/javascript" src="/js/jquery.flot.pack.js"></script>
    <script src="/js/graphs.js"></script>
-->
    <!--<script src="/js/jquery.tipsy.js"></script>-->
    <script src="/js/scripts.js"></script>
    <!--<script src="/js/facebox.js"></script>-->
    <!--[if IE]>
    <script language="javascript" type="text/javascript" src="js/excanvas.pack.js"></script>
    <![endif]-->

    <!--[if IE 6]>
    <script src="js/pngfix.js"></script>
    <script>
        DD_belatedPNG.fix('.png_bg');
    </script>        
    <![endif]-->

    <link href="/css/facebox.css" rel="stylesheet">
    <link href="/css/theme-style.css" rel="stylesheet">
    <link href="/css/myfedha-style.css" rel="stylesheet">

    <?php if (isset($file_uploader) && $file_uploader){ ?>
    <link rel="stylesheet" href="/js/jquery-fileupload/css/jquery.fileupload-ui.css">
	<link rel="stylesheet" href="http://blueimp.github.com/cdn/css/bootstrap.min.css">

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="/js/jquery-fileupload/vendor/jquery.ui.widget.js"></script>
	<script src="http://blueimp.github.com/JavaScript-Templates/tmpl.min.js"></script>
	<script src="http://blueimp.github.com/JavaScript-Load-Image/load-image.min.js"></script>
	<script src="http://blueimp.github.com/JavaScript-Canvas-to-Blob/canvas-to-blob.min.js"></script>
	<script src="http://blueimp.github.com/cdn/js/bootstrap.min.js"></script>
	<script src="http://blueimp.github.com/Bootstrap-Image-Gallery/js/bootstrap-image-gallery.min.js"></script>

	<script src="/js/jquery-fileupload/jquery.iframe-transport.js"></script>
	<script src="/js/jquery-fileupload/jquery.fileupload.js"></script>
	<script src="/js/jquery-fileupload/jquery.fileupload-fp.js"></script>
	<script src="/js/jquery-fileupload/jquery.fileupload-ui.js"></script>
	<script src="/js/jquery-fileupload/main.js"></script>
    <?php } ?>

</head>
<body>

<div id="header" class="png_bg">

    <div id="head_wrap" class="container_12">
    
        <!-- start of logo - you could replace this with an image of your logo -->
        <div id="logo" class="grid_4">
          <h1>My<span>Fedha</span></h1>
        </div>
        <!-- end logo -->
        
        <!-- start control panel -->
        <div id="controlpanel" class="grid_8">
        
            <ul>
            
                <?php if ($this->session->userdata('logged_in')) { ?>

                <li><p>Signed in as <strong><?php echo $this->user->name; ?></strong></p></li>
                <li><a href="/users/change_password" class="first">Settings</a></li>
                <li><a href="/users/logout" class="last">Sign Out</a></li>

                <?php } else { ?>

                <li><a href="/users/login">Login</a></li>
                <li><a href="/users/register">Register</a></li>

                <?php } ?>
                
            </ul>
            
        </div>
        <!-- end control panel -->
    
        <!-- start navigation -->
        <nav id="navigation" class="grid_12">
            <ul>
                <li><a href="/dashboard" class="<?php echo ($this->uri->segment(1)=='dashboard')?'active':''; ?>">Dashboard</a></li>
                <li><a href="/accounts" class="<?php echo (in_array($this->uri->segment(1),array('accounts','transactions')))?'active':''; ?>">Accounts</a></li>
                <li><a href="/budget" class="<?php echo ($this->uri->segment(1)=='budget')?'active':''; ?>">Budget</a></li>
                <li><a href="/import" class="<?php echo ($this->uri->segment(1)=='import')?'active':''; ?>">Import</a></li>
            </ul>
        </nav>
        <!-- end navigation -->
     
    </div><!-- end headwarp  -->
</div><!-- end header -->

<!-- EVERYTING BELOW IS THE MAIN CONTENT -->

<div id="main_content_wrap" class="container_12">

    <?php if ($this->session->flashdata('notice')) { ?>
    <div class="notification information canhide">
        <p><strong>INFORMATION: </strong>
        <?php echo $this->session->flashdata('notice'); ?>
        </p>
    </div>   
    <?php } ?>

    <?php if ($this->session->flashdata('warning')) { ?>
    <div class="notification lightbulb canhide">
        <p><strong>NOTIFICATION: </strong>
        <?php echo $this->session->flashdata('warning'); ?>
        </p>
        
    </div>
    <?php } ?>

    <?php if ($this->session->flashdata('warning')) { ?>
    <div class="notification warning canhide">
        <p><strong>WARNING: </strong>
        <?php echo $this->session->flashdata('warning'); ?>
        </p>
    </div> 
    <?php } ?>

    <?php if ($this->session->flashdata('success')) { ?>
    <div class="notification success canhide">
        <p><strong>SUCCESS: </strong>
        <?php echo $this->session->flashdata('success'); ?>
        </p>
    </div>  
    <?php } ?>

    <?php if ($this->session->flashdata('error')) { ?>
    <div class="notification failure canhide">
        <p><strong>FAILURE: </strong>
        <?php echo $this->session->flashdata('error'); ?>
        </p>
    </div>
    <?php } ?>

            
            
            

