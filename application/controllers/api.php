<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

    public function __construct ()
    {
        parent::__construct();

		// restrict if we need to
		$restricted_paths = array('import');
		if (in_array($this->uri->segment(2),$restricted_paths)) {
			$this->user->restrict();
			$this->load->model('transaction');
			$this->load->model('account');

			// load account
			if ($this->uri->segment(3)) {
				// get account
				try {
					$this->account->load_account($this->uri->segment(3));
				} catch (Exception $e) {
					// user has no accounts
					$this->session->set_flashdata('error',$e->getMessage());
					header("Location: /accounts");
				}
			} else {
				// get default account
				try {
					$this->account->load_account();
				} catch (Exception $e) {
					// user has no accounts
					$this->session->set_flashdata('error',$e->getMessage());
					header("Location: /accounts");
				}
			}
		}

		header('Content-Type: application/json');
    }

	public function index ()
	{
		echo json_encode(false);
	}

	public function upload()
	{
		// initialize upload handler (and process upload)
		require('UploadHandler.php');
		$options = array(
			'user_dirs' => true,
			'download_via_php' => true
		);
		$initialize = true;
		$upload_handler = new UploadHandler($options, $initialize);
	}

	public function import()
	{
		// initialize upload handler
		require('UploadHandler.php');
		$options = array(
			'user_dirs' => true,
			'download_via_php' => true
		);
		$initialize = false;
		$upload_handler = new UploadHandler($options, $initialize);

		// read file
		$file = current($upload_handler->get(false));
		$file = 'files/'.session_id().'/'.$file->name;
		if (file_exists($file)) {
			$contents = file_get_contents($file);
			$contents = json_decode($contents, true);
			foreach ($contents['transactions'] as $i=>$c) {
				echo $i.') '.$c['description']."\n";
			}
			$retval = true;
		} else {
			$retval = false;
		}

		echo json_encode($retval);
		exit;
	}

}

/* End of file api.php */
/* Location: ./application/controllers/api.php */
