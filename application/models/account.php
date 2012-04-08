<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once('model.php');

/**
 * Dependencies: user, account
 */
class Account extends Model {

    public function getId ()
    {
        return isset($this->_data->account_id) ? $this->_data->account_id : null;
    }

    public function load_account ($account_name=null)
    {
        if (is_null($account_name)) {
            // get default account
            $account = $this->get_default_account($account_name);
        } else {
            $account = $this->get_account($account_name);
        }
        if (empty($account)) {
            throw new Exception("Could not find the account.");
        }
        $this->_data = $account;
        $this->_load();
    }

    public function get_account ($account_id=null)
    {
        if (ctype_digit($account_id)) {
            return $this->db->where(array('account_id'=>$account_id,'user_id'=>$this->user->id))->get('accounts')->row();
        } else if (is_string($account_id)) {
            return $this->db->where(array('slug'=>$account_id,'user_id'=>$this->user->id))->get('accounts')->row();
        } else {
            return $this->db->where(array('default'=>true,'user_id'=>$this->user->id))->get('accounts')->row();
        }
    }

    public function get_default_account ()
    {
        return $this->db->where(array('default'=>true,'user_id'=>$this->user->id))->get('accounts')->row();
    }

    public function get_transactions ($account_id=null)
    {
        if (!is_null($account_id)) {
            $account = $this->get_account($account_id);
        } else {
            $account = $this;
        }
        return $this->db->where(array('to_account_id'=>$account->account_id,'user_id'=>$this->user->id))->order_by('date','desc')->get('transactions')->result();
    }

    public function insert ()
    {
        $this->load->library('TextUtilities');

        $account = array();
        $account['slug'] = $this->textutilities->stem($this->input->post('name'));
        $account['user_id'] = $this->user->id;
        $account['name'] = $this->input->post('name');
        $account['description'] = $this->input->post('description');
        $account['amount'] = $this->input->post('amount');
        $account['default'] = (bool) $this->input->post('default');
        $account['created'] = date("Y-m-d H:i:s");

        // check if account exists
        $account_name = $this->db->where(array('user_id'=>$this->user->id,'slug'=>$account['slug']))->get('accounts')->row_array();
        if (!empty($account_name)) {
            throw new Exception("Account name already taken.");
        }

        $this->db->insert('accounts', $account);

        return $this->get_account($account['slug']);
    }

    public function update ()
    {
        $this->load->library('TextUtilities');

        $account = (array) $this->get_account($this->uri->segment(3));
        $account['slug'] = $this->textutilities->stem($this->input->post('name'));
        $account['name'] = $this->input->post('name');
        $account['description'] = $this->input->post('description');
        $account['amount'] = $this->input->post('amount');
        $account['default'] = (bool) $this->input->post('default');

        // check if account exists
        $account_name = $this->db->where(array('user_id'=>$this->user->id,'slug'=>$account['slug']))->get('accounts')->row_array();
        if (!empty($account_name) && $account_name['account_id'] != $account['account_id']) {
            throw new Exception("Account name already taken.");
        }

        $this->db->where(array('account_id'=>$account['account_id']))->update('accounts', $account);

        return $this->get_account($account['account_id']);
    }

}

/* End of file account.php */
/* Location: ./application/models/account.php */
