<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dashboard extends CI_Controller {

    public function __construct ()
    {
        parent::__construct();
        $this->user->restrict('/pages/about');
    }

	public function index()
	{
		$this->load->view('t/header');
		$this->load->view('dashboard/index');
		$this->load->view('t/footer');
	}
}

/* End of file dashboard.php */
/* Location: ./application/controllers/dashboard.php */
