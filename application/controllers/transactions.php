<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Transactions extends CI_Controller {

    public function __construct ()
    {
        parent::__construct();
        $this->user->restrict();
        $this->load->model('transaction');
        $this->load->model('account');
    }

	public function index ($type=null)
	{
        if (is_null($type)) {
            // get default account
            try {
                $this->account->load_account();
            } catch (Exception $e) {
                // user has no accounts
                $this->session->set_flashdata('error',$e->getMessage());
                header("Location: /accounts");
            }
        } else {
            // lookup account
            $this->account->load_account($type);
        }

        $body['account'] = $this->account;
        $body['transactions'] = array();
		$this->load->view('t/header');
		$this->load->view('transactions/index',$body);
		$this->load->view('t/footer');
	}

    public function add ($type=null)
    {
        if (is_null($type)) {
            // get default account
        } else {
            // lookup account
        }

		$this->load->view('t/header');
		$this->load->view('transactions/add');
		$this->load->view('t/footer');
    }
}

/* End of file transactions.php */
/* Location: ./application/controllers/transactions.php */
