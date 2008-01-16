<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Code Igniter
 *
 * An open source application development framework for PHP 4.3.2 or newer
 *
 * @package		CodeIgniter
 * @author		Rick Ellis
 * @copyright	Copyright (c) 2006, EllisLab, Inc.
 * @license		http://www.codeigniter.com/user_guide/license.html
 * @link		http://www.codeigniter.com
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Database Utility Class
 *
 * @category	Database
 * @author		Rick Ellis
 * @link		http://www.codeigniter.com/user_guide/database/
 */
class CI_DB_forge {

	var $fields		 	= array();
	var $keys			= array();
	var $primary_keys 	= array();
	var $db_char_set	=	'';

	/**
	 * Constructor
	 *
	 * Grabs the CI super object instance so we can access it.
	 *
	 */	
	function CI_DB_forge()
	{
		// Assign the main database object to $this->db
		$CI =& get_instance();
		$this->db =& $CI->db;

		log_message('debug', "Database Forge Class Initialized");
	}

	// --------------------------------------------------------------------

	/**
	 * Create database
	 *
	 * @access	public
	 * @param	string	the database name
	 * @return	bool
	 */
	function create_database($db_name)
	{
		$sql = $this->_create_database($db_name);
		
		if (is_bool($sql))
		{
			return $sql;
		}
	
		return $this->db->query($sql);
	}

	// --------------------------------------------------------------------

	/**
	 * Drop database
	 *
	 * @access	public
	 * @param	string	the database name
	 * @return	bool
	 */
	function drop_database($db_name)
	{
		$sql = $this->_drop_database($db_name);
		
		if (is_bool($sql))
		{
			return $sql;
		}
	
		return $this->db->query($sql);
	}

	// --------------------------------------------------------------------

	/**
	 * Add Key
	 *
	 * @access	public
	 * @param	string	key
	 * @param	string	type
	 * @return	void
	 */
	function add_key($key = '', $primary = FALSE)
	{
		if ($key == '')
		{
			show_error('Key information is required for that operation.');
		}
		
		if ($primary === TRUE)
		{
			$this->primary_keys[] = $key;
		}
		else
		{
			$this->keys[] = $key;
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Add Field
	 *
	 * @access	public
	 * @param	string	collation
	 * @return	void
	 */
	function add_field($field = '')
	{
		if ($field == '')
		{
			show_error('Field information is required.');
		}
		
		if (is_string($field))
		{
			if ($field == 'id')
			{
				$this->fields[] = array('id' => array(
										'type' => 'INT',
										'constraint' => 9,
										'auto_increment' => TRUE
										)
									);									
				$this->add_key('id', TRUE);
			}
			else
			{
				if (strpos($field, ' ') === FALSE)
				{
					show_error('Field information is required for that operation.');
				}
				
				$this->fields[] = $field;
			}
		}
		
		if (is_array($field))
		{
			$this->fields = array_merge($this->fields, $field);
		}
		
	}

	// --------------------------------------------------------------------

	/**
	 * Create Table
	 *
	 * @access	public
	 * @param	string	the table name
	 * @return	bool
	 */
	function create_table($table = '', $if_not_exists = FALSE)
	{	
		if ($table == '')
		{
			show_error('A table name is required for that operation.');
		}
			
		if (count($this->fields) == 0)
		{	
			show_error('Field information is required.');
		}

		$sql = $this->_create_table($table, $this->fields, $this->primary_keys, $this->keys, $if_not_exists);

		$this->_reset();
		return $this->db->query($sql);
	}

	// --------------------------------------------------------------------

	/**
	 * Drop Table
	 *
	 * @access	public
	 * @param	string	the table name
	 * @return	bool
	 */
	function drop_table($table_name)
	{
		$sql = $this->_drop_table($table_name);
		
		if (is_bool($sql))
		{
			return $sql;
		}
	
		return $this->db->query($sql);
	}

	// --------------------------------------------------------------------

	/**
	 * Column Add
	 *
	 * @access	public
	 * @param	string	the table name
	 * @param	string	the column name
	 * @param	string	the column definition
	 * @return	bool
	 */
	function add_column($table = '', $field = array(), $after_field = '')
	{
		if ($table == '')
		{
				show_error('A table name is required for that operation.');
		}

		// add field info into field array, but we can only do one at a time
		// so only grab the first field in the event there are more then one
		$this->add_field(array_slice($field, 0, 1));

		if (count($this->fields) == 0)
		{	
			show_error('Field information is required.');
		}

		$sql = $this->_alter_table('ADD', $table, $this->fields, $after_field);

		$this->_reset();
		return $this->db->query($sql);
	}

	// --------------------------------------------------------------------

	/**
	 * Column Drop
	 *
	 * @access	public
	 * @param	string	the table name
	 * @param	string	the column name
	 * @return	bool
	 */
	function drop_column($table = '', $column_name = '')
	{
	
		if ($table == '')
		{
				show_error('A table name is required for that operation.');
		}

		if ($column_name == '')
		{
				show_error('A column name is required for that operation.');
		}

		$sql = $this->_alter_table('DROP', $table, $column_name);
	
		return $this->db->query($sql);
	}

	// --------------------------------------------------------------------

	/**
	 * Column Modify
	 *
	 * @access	public
	 * @param	string	the table name
	 * @param	string	the column name
	 * @param	string	the column definition
	 * @return	bool
	 */
	function modify_column($table = '', $field = array())
	{
	
		if ($table == '')
		{
				show_error('A table name is required for that operation.');
		}

		// add field info into field array, but we can only do one at a time
		// so only grab the first field in the event there are more then one
		$this->add_field(array_slice($field, 0, 1));

		if (count($this->fields) == 0)
		{	
			show_error('Field information is required.');
		}

		$sql = $this->_alter_table('CHANGE', $table, $this->fields);

		$this->_reset();
		return $this->db->query($sql);
	}

	// --------------------------------------------------------------------

	/**
	 * Reset
	 *
	 * Resets table creation vars
	 *
	 * @access	private
	 * @return	void
	 */
	function _reset()
	{
		$this->fields 		= array();
		$this->keys			= array();
		$this->primary_keys 	= array();
	}

}
?>