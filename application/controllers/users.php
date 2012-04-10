<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Controller {

    public function __construct ()
    {
        parent::__construct();
        $this->load->model('user');
    }

	public function index ()
	{
		$this->load->view('t/header');
		$this->load->view('users/index');
		$this->load->view('t/footer');
	}

    public function login ()
    {
        $header = array();
        $body = array();
        $error = null;

        // check if already logged in
        if ($this->session->userdata('logged_in')) {
            header("Location: /dashboard");
            exit;
        }

        // check if we just need to confirm
        $user = $this->session->userdata('user');
        if (isset($user['confirmation_code']) && $user['confirmation_code']) {
            header("Location: /users/confirm");
            exit;
        }

        // process input
        if ($this->input->post('username')) {
            try {
                if ($this->user->login()) {
                    header("Location: /dashboard");
                    exit;
                } else {
                    $error = 'Username or password are incorrect.';
                }
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $header['error'] = $error;
		$this->load->view('t/header-login',$header);
		$this->load->view('users/login',$body);
		$this->load->view('t/footer-login');
    }

    public function logout ()
    {
        $this->session->set_userdata(array('user'=>array()));
        $this->session->set_userdata(array('logged_in'=>false));
        header("Location: /users/login");
        exit;
    }

    public function register ()
    {
        $header = array();
        $body = array();
        $error = null;

        // check if already logged in
        if ($this->session->userdata('user')) {
            header("Location: /dashboard");
            exit;
        }

        // process form
        if ($this->input->post('username')) {
            try {
                $user = $this->user->insert();
                $this->session->userdata(array('user'=>$user));
                header("Location: /users/confirm_instructions");
                exit;
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $header['error'] = $error;

		$this->load->view('t/header-splash',$header);
		$this->load->view('users/register',$body);
		$this->load->view('t/footer');
    }

    public function confirm ()
    {
        $header = array();
        $body = array();

        // process form
        if ($this->input->get('confirmation_code')) {
            try {
                $this->user->confirm();
                header("Location: /dashboard");
                exit;
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $header['error'] = $error;

		$this->load->view('t/header',$header);
		$this->load->view('users/confirm',$body);
		$this->load->view('t/footer');
    }

    /**
     * Resend the confirmation email
     */
    public function confirm_resend ()
    {
        $header = array();
        $body = array();
        $error = null;

        // resend confirmation
        try {
            $this->user->confirm_resend();
        } catch (Exception $e) {
            $error = $e->getMessage();
        }

        $header['error'] = $error;
		$this->load->view('t/header',$header);
		$this->load->view('users/confirm_resend',$body);
		$this->load->view('t/footer');
    }

    public function confirm_instructions ()
    {
		$this->load->view('t/header');
		$this->load->view('users/confirm_instructions');
		$this->load->view('t/footer');
    }

    public function disabled ()
    {
		$this->load->view('t/header');
		$this->load->view('users/disabled');
		$this->load->view('t/footer');
    }

    public function reset_password ()
    {
        $header = array();
        $body = array();
        $error = null;
        $reset_sent = false;

        // process form
        if ($this->input->get('temporary_password')) {
            // confirmation
            try {
                $this->user->reset_password_confirm();
                header("Location: /users/change_password");
                exit;
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        } else if ($this->input->post('username')) {
            // send reset email
            try {
                $this->user->reset_password();
                $reset_sent = true;
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $header['error'] = $error;
		$this->load->view('t/header',$header);
        if ($reset_sent) {
            $this->load->view('users/reset_password_sent');
        } else {
            $this->load->view('users/reset_password',$body);
        }
		$this->load->view('t/footer');
    }

    public function change_password ()
    {
        $header = array();
        $body = array();
        $error = null;

        // process form
        if ($this->input->post('password') && $this->input->post('password_again')) {
            try {
                $this->user->change_password();
                $this->session->set_flashdata('success','Password was changed.');
                header("Location: /dashboard");
                exit;
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $header['error'] = $error;
		$this->load->view('t/header',$header);
		$this->load->view('users/change_password',$body);
		$this->load->view('t/footer');
    }

}

/* End of file users.php */
/* Location: ./application/controllers/users.php */
