<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>About MyFedha</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
    <script src="/js/jquery.validate.js"></script>
    <script src="/js/login.js"></script>
    <script src="/js/jquery.tipsy.js"></script>
    <script src="/js/scripts.js"></script>
    <script src="/js/facebox.js"></script>
    <script type="text/javascript" src="js/jquery.flot.pack.js"></script>
    <!--[if IE]>
    <script language="javascript" type="text/javascript" src="js/excanvas.pack.js"></script>
    <![endif]-->

    <!--[if IE 6]>
    <script src="js/pngfix.js"></script>
    <script>
        DD_belatedPNG.fix('.png_bg');
    </script>        
    <![endif]-->

    <script src="/js/graphs.js"></script>

    <link href="/css/facebox.css" rel="stylesheet" type="text/css" />
    <link href="/css/theme-style.css" rel="stylesheet" type="text/css">
    <link href="/css/myfedha-style.css" rel="stylesheet" type="text/css">

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
                <?php /*<li><a href="/users/register">Register</a></li>*/ ?>

                <?php } ?>
                
            </ul>
            
        </div>
        <!-- end control panel -->
     
        <p>&nbsp;</p>
    </div><!-- end headwarp  -->
</div><!-- end header -->

<!-- EVERYTING BELOW IS THE MAIN CONTENT -->

<div id="main_content_wrap" class="container_12">

    <?php if (isset($info) || $this->session->flashdata('info')) { ?>
    <div class="notification information canhide">
        <p><strong>INFORMATION: </strong>
        <?php echo isset($info) ? $info : null; ?>
        <?php echo $this->session->flashdata('info'); ?>
        </p>
    </div>   
    <?php } ?>

    <?php if (isset($notice) || $this->session->flashdata('notice')) { ?>
    <div class="notification lightbulb canhide">
        <p><strong>NOTIFICATION: </strong>
        <?php echo isset($notice) ? $notice : null; ?>
        <?php echo $this->session->flashdata('notice'); ?>
        </p>
        
    </div>
    <?php } ?>

    <?php if (isset($warning) || $this->session->flashdata('warning')) { ?>
    <div class="notification warning canhide">
        <p><strong>WARNING: </strong>
        <?php echo isset($warning) ? $warning : null; ?>
        <?php echo $this->session->flashdata('warning'); ?>
        </p>
    </div> 
    <?php } ?>

    <?php if (isset($success) || $this->session->flashdata('success')) { ?>
    <div class="notification success canhide">
        <p><strong>SUCCESS: </strong>
        <?php echo isset($success) ? $success : null; ?>
        <?php echo $this->session->flashdata('success'); ?>
        </p>
    </div>  
    <?php } ?>

    <?php if (isset($error) || $this->session->flashdata('error')) { ?>
    <div class="notification failure canhide">
        <p><strong>FAILURE: </strong>
        <?php echo isset($error) ? $error : null; ?>
        <?php echo $this->session->flashdata('error'); ?>
        </p>
    </div>
    <?php } ?>

            
            
            

