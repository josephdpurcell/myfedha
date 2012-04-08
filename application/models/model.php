<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package		CodeIgniter
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2008 - 2011, EllisLab, Inc.
 * @license		http://codeigniter.com/user_guide/license.html
 * @link		http://codeigniter.com
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * CodeIgniter Model Class
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Libraries
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/config.html
 */
class Model extends CI_Model {

    protected $_data;

	/**
	 * Constructor
	 *
	 * @access public
	 */
	function __construct()
	{
		log_message('debug', "Model Class Initialized");
	}

    function _load ()
    {
        if (!empty($this->_data)) {
            foreach ($this->_data as $key=>$value) {
                $this->$key = $value;
            }
        }
    }

    public function __get ($name)
    {
		$CI =& get_instance();
        $fn = 'get'.ucfirst($name);
        if (!empty($this->_data) && array_key_exists($name,$this->_data)) {
            return $this->_data[$name];
        } else if (method_exists($this,$fn)) {
            return $this->$fn();
        } else if ($CI->$name) {
            return $CI->$name;
        }
        return null;
    }

}
// END Model Class

/* End of file Model.php */
/* Location: ./system/core/Model.php */
