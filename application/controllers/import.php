<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Import extends CI_Controller {

    public function __construct ()
    {
        parent::__construct();
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

	public function index ()
	{
        $body['account'] = $this->account;
		$this->load->view('t/header');
		$this->load->view('import/index',$body);
		$this->load->view('t/footer');
	}

	public function view ()
	{
		die('2');
        $body['account'] = $this->account;
        $body['transactions'] = $this->account->get_transactions();
		$this->load->view('t/header');
		$this->load->view('transactions/view',$body);
		$this->load->view('t/footer');
	}

    public function add ($account_slug)
    {
		die('3');
        if ($this->input->post('amount')) {
            try {
                $this->transaction->insert();
                $this->session->set_flashdata('success','Transaction of $'.$this->input->post('amount').' was added.');
                header('Location: /transactions/add/'.$this->account->slug);
            } catch (Exception $e) {
                $this->session->set_flashdata('error',$e->getMessage());
            }
        }

        $body['account'] = $this->account;
		$this->load->view('t/header');
		$this->load->view('transactions/add',$body);
		$this->load->view('t/footer');
    }

    public function edit ($account_slug,$transaction_id)
    {
		die('4');
        try {
            $transaction = $this->transaction->get_transaction($transaction_id);
        } catch (Exception $e) {
            $this->session->set_flashdata('error',$e->getMessage());
            header("Location: /transactions");
        }

        if ($this->input->post('amount')) {
            try {
                $this->transaction->update();
                $this->session->set_flashdata('success','Transaction of $'.$this->input->post('amount').' was updated.');
                header('Location: /transactions/view/'.$this->account->slug);
            } catch (Exception $e) {
                $this->session->set_flashdata('error',$e->getMessage());
            }
            $transaction->date = $this->input->post('date');
            $transaction->amount = $this->input->post('amount');
            $transaction->description = $this->input->post('description');
            $transaction->tags = $this->input->post('tags');
        }
        $transaction->date = date("n/j/y",strtotime($transaction->date));

        $body['account'] = $this->account;
        $body['transaction'] = $transaction;
		$this->load->view('t/header');
		$this->load->view('transactions/edit',$body);
		$this->load->view('t/footer');
    }

    public function delete ($account_id,$transaction_id)
    {
		die('5');
        if ($this->transaction->delete()) {
            $this->session->set_flashdata('success','Transaction was deleted.');
        } else {
            $this->session->set_flashdata('error','Transaction was NOT deleted.');
        }
        header("Location: /transactions/view/{$this->account->slug}");
    }
}

/* End of file transactions.php */
/* Location: ./application/controllers/transactions.php */
