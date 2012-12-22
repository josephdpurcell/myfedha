<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

    public function __construct ()
    {
        parent::__construct();
		header('Content-Type: application/json');
    }

	public function index ()
	{
		echo json_encode(false);
	}

	public function upload()
	{
		require('UploadHandler.php');
		$upload_handler = new UploadHandler(array(
			'user_dirs' => true,
			'download_via_php' => true
		));
	}

}

/* End of file api.php */
/* Location: ./application/controllers/api.php */
