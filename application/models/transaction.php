<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once('model.php');

/**
 * Dependencies: user, account
 */
class Transaction extends Model {

    public function getId()
    {
        return $this->transaction_id;
    }

    public function get_transaction ($transaction_id=null)
    {
        if (ctype_digit($transaction_id)) {
            return $this->db->where(array('transaction_id'=>$transaction_id))->get('transactions')->row();
        } else {
            throw new Exception("Invalid transaction ID.");
        }
    }

    public function insert ()
    {
        $t = array();
        $t['user_id'] = $this->user->id;
        $t['to_account_id'] = $this->account->id;
        $t['date'] = date("Y-m-d H:i:s",strtotime($this->input->post('date')));
        $t['amount'] = $this->input->post('amount');
        $t['description'] = $this->input->post('description');
        $t['tags'] = $this->input->post('tags');
        $t['created'] = date("Y-m-d H:i:s");

        if (!$this->db->insert('transactions', $t)) {
            throw new Exception("Saving transaction failed.");
        }

        return $this->db->where(array('user_id'=>$this->user->id,'transaction_id'=>$this->db->insert_id()))->get('transactions')->row();
    }

    public function update ()
    {
        $t = array();
        $t['user_id'] = $this->user->id;
        $t['to_account_id'] = $this->account->id;
        $t['date'] = date("Y-m-d H:i:s",strtotime($this->input->post('date')));
        $t['amount'] = $this->input->post('amount');
        $t['description'] = $this->input->post('description');
        $t['tags'] = $this->input->post('tags');

        return $this->db->where(array('user_id'=>$this->user->id,'transaction_id'=>$this->uri->segment(4)))->update('transactions',$t);
    }

    public function delete ()
    {
        return $this->db->delete('transactions',array('transaction_id'=>$this->uri->segment(4)));
    }

}

/* End of file transaction.php */
/* Location: ./application/models/transaction.php */
