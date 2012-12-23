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

			// gather data
			$data = array();
			foreach ($contents['transactions'] as $i=>$c) {
				$t = array();
				$debit = ($c['bookkeeping_type']=='debit' ? -1 : 1);
				$t['user_id'] = $this->user->id;
				$t['to_account_id'] = $this->account->id;
				$t['date'] = preg_replace('/\.[^\.]*$/','',$c['times']['when_recorded_local']); // strip seconds
				$t['amount'] = ($c['amounts']['amount'] / 10000 * $debit);
				$t['description'] = $c['description'];
				$t['tags'] = $c['categories'][0]['name'];
				$t['created'] = date("Y-m-d H:i:s");
				$t['simple_id'] = $c['uuid'];
				$data[] = $t;
			}

			// bulk insert
			try {
				$this->transaction->bulk_insert($data);
				$retval = array(
					'success' => true,
					'message' => $this->transaction->duplicates.' duplicates were found.'
					);
			} catch(Exception $e) {
				$retval = array(
					'success' => false,
					'message' => $e->getMessage()
					);
			}
		} else {
			$retval = array(
				'success' => false,
				'message' => 'Uploaded file not found'
				);
		}

		echo json_encode($retval);
		exit;
	}

}

/* End of file api.php */
/* Location: ./application/controllers/api.php */
