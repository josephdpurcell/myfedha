<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pages extends CI_Controller {

	public function index ()
	{
        $this->about();
	}

    public function about ()
    {
        if ($this->user->id) {
            $this->load->view('t/header');
        } else {
            $this->load->view('t/header-splash');
        }
		$this->load->view('pages/about');
		$this->load->view('t/footer');
    }

}

/* End of file pages.php */
/* Location: ./application/controllers/pages.php */
