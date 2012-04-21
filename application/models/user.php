<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User extends Model {

    private $_user_id;

    public function __construct ()
    {
        parent::__construct();
        $this->load->library('email');
        $this->load->helper('string');
        $this->_data = $this->session->userdata('user');
        $this->_load();
    }

    public function getLogged_In ()
    {
        return $this->session->userdata('logged_in');
    }

    public function getId ()
    {
        return isset($this->_data['user_id']) ? $this->_data['user_id'] : null;
    }

    public function getAccounts ()
    {
        return $this->db->where(array('user_id'=>$this->user_id))->get('accounts')->result();
    }
    
    public function get_user ($user_id=null)
    {
        if (ctype_digit($user_id)) {
            return $this->db->where(array('user_id'=>$user_id))->get('users')->row_array();
        } else if (is_string($user_id)) {
            return $this->db->where(array('username'=>$user_id))->get('users')->row_array();
        } else {
            $user = $this->session->userdata('user');
            return $this->db->where(array('username'=>$user['username']))->get('users')->row_array();
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

    public function confirm ()
    {
        $retval = true;

        // get user
        $username = ($this->session->userdata('username')) ? $this->session->userdata('username') : $this->input->get('username');
        $user = $this->db->where(array('username'=>$username))->get('users')->row_array();

        // check if user is already confirmed
        if (empty($user['confirmation_code'])) {
            throw new Exception("User has already been confirmed.");
        }

        // check if code is correct
        if ($this->input->get('confirmation_code')!=$user['confirmation_code']) {
            throw new Exception("Confirmation code is incorrect.");
        }

        if ($this->db->where('confirmation_code',$this->input->get('confirmation_code'))->update('users',array('enabled'=>1,'confirmation_code'=>''))) {
            // send email to user
            $this->email->from('admin@myfedha.com', 'MyFedha');
            $this->email->to($user['email']); 
            $this->email->subject('Welcome to MyFedha');
            $this->email->message("Congratulations on signing up. Explore these features (list them).");
            $this->email->send();
        } else {
            // send email to admin
            $this->email->from($user['email'], $user['name']);
            $this->email->to('josephdpurcell@gmail.com'); 
            $this->email->subject('A Confirm New User [FAIL]');
            $this->email->message("FAILED TO CONFIRM CREATE USER!");  
            $this->email->send();
            $retval = false;
        }

        // attempt to login again
        $this->login();

        return $retval;
    }

    public function login ()
    {
        $retval = true;

        // check for session
        if ($this->session->userdata('logged_in')) {
            return true;
        }

        // get user from session
        $session_user = $this->session->userdata('user');
        // TODO: check cookie user

        // set username
        $username = '';
        if ($this->input->post('username')) {
            $username = $this->input->post('username');
        } else if (isset($session_user['username']) && $session_user['username']) {
            $username = $session_user['username'];
        }

        // set email
        $email = '';
        if ($this->input->post('email')) {
            $email = $this->input->post('email');
        } else if (isset($session_user['email']) && $session_user['email']) {
            $email = $session_user['email'];
        }

        // set password
        $password = '';
        $password_is_sha1 = false;
        if ($this->input->post('password')) {
            $password = $this->input->post('password');
        } else if ($session_user['password']) {
            $password = $session_user['password'];
            $password_is_sha1 = true;
        }

        // find user by username or email
        $user = $this->db->where(array('username'=>$username))->get('users')->row_array();
        if (empty($user)) {
            $user = $this->db->where(array('email'=>$email))->get('users')->row_array();
            if (empty($user)) {
                $retval = false;
            }
        }

        // check for empty fields
        if ((empty($username) && empty($email)) || empty($password)) {
            $retval = false;
        }

        // check password
        if ($retval) {
            if ($password_is_sha1) {
                if ($password!=$user['password']) {
                    $retval = false;
                }
            } else {
                $check_password = sha1($this->config->item('salt').$password);
                if ($check_password!=$user['password']) {
                    $retval = false;
                }
            }
        }

        // set userdata
        if ($retval) {
            $this->session->set_userdata(array('user'=>$user));
        }

        // check if user is confirmed
        if ($retval && !$user['enabled'] && !empty($user['confirmation_code'])) {
            header("Location: /users/confirm");
            exit;
        }

        // check if user is enabled
        if ($retval && !$user['enabled']) {
            header("Location: /users/disabled");
            exit;
        }

        // if completed all tasks, login
        if ($retval) {
            $this->session->set_userdata(array('logged_in'=>true));
        }

        return $retval;
    }

    public function confirm_resend ()
    {
        $session_user = $this->session->userdata('user');
        $user = $this->db->where(array('username'=>$session_user['username']))->get('users')->row_array();
        if (!$user) {
            throw new Exception("Could not find user.");
        }

        // send email to user
        $confirm_url = $this->config->base_url()."users/confirm?username={$user['username']}&confirmation_code={$user['confirmation_code']}";
        $this->email->from('admin@myfedha.com', 'MyFedha');
        $this->email->to($user['email']); 
        $this->email->subject('Complete Your Registration');
        $this->email->message("Please go here to confirm:\n$confirm_url");
        $this->email->send();
    }

    public function reset_password ()
    {
        // get the user
        $user = $this->db->where(array('username'=>$this->input->post('username')))->get('users')->row_array();
        if (!$user) {
            $user = $this->db->where(array('email'=>$this->input->post('email')))->get('users')->row_array();
            if (!$user) {
                throw new Exception("Could not find user.");
            }
        }

        $confirmation_code = random_string('alnum',8);
        $this->db->where('username',$this->input->post('username'))->update('users',array('confirmation_code'=>$confirmation_code));

        // send email to user
        $reset_url = $this->config->base_url()."users/reset_password?username={$user['username']}&temporary_password={$confirmation_code}";
        $this->email->from('admin@myfedha.com', 'MyFedha');
        $this->email->to($user['email']); 
        $this->email->subject('Reset Your Password');
        $this->email->message("Go here to reset your password:\n$reset_url");
        $this->email->send();
    }

    public function reset_password_confirm ()
    {
        // get the user
        $user = $this->db->where(array('username'=>$this->input->get('username'),'confirmation_code'=>$this->input->get('temporary_password')))->get('users')->row_array();
        if (!$user) {
            throw new Exception("Could not find user.");
        }

        $retval = true;

        if (!$this->db->where('user_id',$user['user_id'])->update('users',array('enabled'=>1,'confirmation_code'=>''))) {
            // send email to user
            $retval = false;
        }

        // attempt to login again
        $this->session->set_userdata(array('user'=>$user));
        $this->login();

        return $retval;
    }

    public function change_password ()
    {
        $password1 = $this->input->post('password');
        $password2 = $this->input->post('password_again');
        if ($password1!=$password2) {
            throw new Exception("Passwords do not match.");
        }

        $password = sha1($this->config->item('salt').$this->input->post('password'));
        $this->db->where('username',$this->input->post('username'))->update('users',array('password'=>$password));
    }

    public function restrict ($redirect_url=false)
    {
        if (!$this->session->userdata('logged_in')) {
            if ($redirect_url) {
                header("Location: {$redirect_url}");
            } else {
                header("Location: /users/login");
            }
        }
    }

}

/* End of file user.php */
/* Location: ./application/models/user.php */
