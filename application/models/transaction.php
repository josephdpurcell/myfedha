<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

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
        $this->db->trans_start();

        // INSERT TRANSACTION
        $t = array();
        $t['user_id'] = $this->user->id;
        $t['to_account_id'] = $this->account->id;
        $t['date'] = date("Y-m-d H:i:s",strtotime($this->input->post('date')));
        $t['amount'] = $this->input->post('amount');
        $t['description'] = $this->input->post('description');
        $t['tags'] = $this->input->post('tags');
        $t['created'] = date("Y-m-d H:i:s");
        $this->db->insert('transactions', $t);

        // PLAY TRANSACTION ON ACCOUNTS
        $this->account->amount = $this->account->amount + $this->input->post('amount');
        $this->db->where(array('user_id'=>$this->user->id,'account_id'=>$this->account->id))->update('accounts',$this->account);

        // check for errors
        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            throw new Exception("Saving transaction failed.");
        }

        // commit
        $this->db->trans_commit();

        return $this->db->where(array('user_id'=>$this->user->id,'transaction_id'=>$this->db->insert_id()))->get('transactions')->row();
    }

    public function update ()
    {
        $this->db->trans_start();

        // GET TRANSACTION
        $transaction = $this->get_transaction($this->uri->segment(4));

        // GET ACCOUNT
        $account = $this->account->get_account($transaction->to_account_id);

        // UN-PLAY TRANSACTION ON ACCOUNTS
        $account->amount = $account->amount - $transaction->amount;
        $this->db->where(array('user_id'=>$this->user->id,'account_id'=>$account->account_id))->update('accounts',$account);

        // PLAY TRANSACTION ON ACCOUNTS
        $account->amount = $account->amount + $this->input->post('amount');
        $this->db->where(array('user_id'=>$this->user->id,'account_id'=>$account->account_id))->update('accounts',$account);

        // UPDATE TRANSACTIONS
        $t = array();
        $t['user_id'] = $this->user->id;
        $t['to_account_id'] = $this->account->id;
        $t['date'] = date("Y-m-d H:i:s",strtotime($this->input->post('date')));
        $t['amount'] = $this->input->post('amount');
        $t['description'] = $this->input->post('description');
        $t['tags'] = $this->input->post('tags');
        $this->db->where(array('user_id'=>$this->user->id,'transaction_id'=>$this->uri->segment(4)))->update('transactions',$t);

        // check for errors
        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            throw new Exception("Deleting transaction failed.");
        }

        // commit
        $this->db->trans_commit();

        return true;
    }

    public function delete ()
    {
        $this->db->trans_start();

        // GET TRANSACTION
        $transaction = $this->get_transaction($this->uri->segment(4));

        // GET ACCOUNT
        $account = $this->account->get_account($transaction->to_account_id);

        // DELETE TRANSACTION
        $this->db->delete('transactions',array('transaction_id'=>$this->uri->segment(4)));

        // UN-PLAY TRANSACTION ON ACCOUNTS
        $account->amount = $account->amount - $transaction->amount;
        $this->db->where(array('user_id'=>$this->user->id,'account_id'=>$account->account_id))->update('accounts',$account);

        // check for errors
        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            throw new Exception("Deleting transaction failed.");
        }

        // commit
        $this->db->trans_commit();

        return true;
    }

}

/* End of file transaction.php */
/* Location: ./application/models/transaction.php */
