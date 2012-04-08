<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Accounts extends CI_Controller {

    public function __construct ()
    {
        parent::__construct();
        $this->user->restrict();
        $this->load->model('account');
    }

	public function index ()
	{
        $accounts = $this->user->accounts;
        if (empty($accounts)) {
            $this->session->set_flashdata('error','You have no accounts!');
        }
        $body['accounts'] = $accounts;
		$this->load->view('t/header');
		$this->load->view('accounts/index',$body);
		$this->load->view('t/footer');
	}

    public function add ()
    {
        if ($this->input->post('name')) {
            try {
                $this->account->insert();
                $this->session->set_flashdata('notice','Account was created');
                header('Location: /accounts');
            } catch (Exception $e) {
                $this->session->set_flashdata('error',$e->getMessage());
            }
        }

		$this->load->view('t/header');
		$this->load->view('accounts/add');
		$this->load->view('t/footer');
    }

    public function edit ($account_id=null)
    {
        try {
            $account = $this->account->get_account($account_id);
        } catch (Exception $e) {
            $this->session->set_flashdata('error',$e->getMessage());
            header("Location: /accounts");
        }

        if ($this->input->post('name')) {
            try {
                $this->account->update();
                $this->session->set_flashdata('notice','Account was updated');
                header('Location: /accounts');
            } catch (Exception $e) {
                $this->session->set_flashdata('error',$e->getMessage());
            }
            $account->name = $this->input->post('name');
            $account->description = $this->input->post('description');
            $account->amount = $this->input->post('amount');
            $account->default = $this->input->post('default');
        }

        $body['account'] = (object) $account;
		$this->load->view('t/header');
		$this->load->view('accounts/edit',$body);
		$this->load->view('t/footer');
    }
}

/* End of file accounts.php */
/* Location: ./application/controllers/accounts.php */
