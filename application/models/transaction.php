<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Dependencies: user, account
 */
class Transaction extends CI_Model {

    private $_transaction_id;
    private $_data;

    public function __get ($name)
    {
        $fn = 'get'.ucfirst($name);
        if (array_key_exists($this->_data[$name])) {
            return $this->_data[$name];
        } else if (method_exists($this,$fn)) {
            return $this->$fn();
        }
        return null;
    }

    public function getId()
    {
        return $this->_transaction_id;
    }

    public function get_transaction ($transaction_id=null)
    {
        if (ctype_digit($transaction_id)) {
            return $this->db->where(array('transaction_id'=>$transaction_id))->get('transactions')->row_array();
        } else {
            throw new Exception("Invalid transaction ID.");
        }
    }

    public function insert ()
    {
        // check if user exists
        $username = $this->db->where(array('username'=>$this->input->post('username')))->get('users')->row_array();
        if (!empty($username)) {
            throw new Exception("Username already taken.");
        }

        $user = array();
        $user['username'] = $this->input->post('username');
        $user['password'] = sha1($this->config->item('salt').$this->input->post('password'));
        $user['name'] = $this->input->post('name');
        $user['email'] = $this->input->post('email');
        $user['created'] = date("Y-m-d H:i:s");
        $user['confirmation_code'] = random_string('alnum',8);

        if ($this->db->insert('users', $user)) {
            // send email to user
            $confirm_url = $this->config->base_url()."users/confirm?username={$user['username']}&confirmation_code={$user['confirmation_code']}";
            $this->email->from('admin@myfedha.com', 'MyFedha');
            $this->email->to($user['email']); 
            $this->email->subject('Complete Your Registration');
            $this->email->message("Please go here to confirm:\n$confirm_url");
            $this->email->send();
            // send email to admin
            $this->email->from($user['email'], $user['name']);
            $this->email->to('josephdpurcell@gmail.com'); 
            $this->email->subject('A New User');
            $this->email->message("A new user has been created!");  
            $this->email->send();
        } else {
            // send email to admin
            $this->email->from($user['email'], $user['name']);
            $this->email->to('josephdpurcell@gmail.com'); 
            $this->email->subject('A New User [FAIL]');
            $this->email->message("FAILED TO CREATE USER!");  
            $this->email->send();
        }

        return $this->db->where(array('username'=>$this->input->post('username')))->get('users')->row_array();
    }

    public function update ()
    {
        $this->db->update('users', $user, array('username'=>$user['username']));
    }

}

/* End of file transaction.php */
/* Location: ./application/models/transaction.php */
