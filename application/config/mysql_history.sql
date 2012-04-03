-- --------------------------------------------------------
-- mysql_history.sql
--
-- The chronicle of database changes.
-- --------------------------------------------------------

-- --------------------------------------------------------
-- Create Care Tables
-- April 2, 2012

CREATE TABLE `users` (
  `user_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `level` tinyint(1) unsigned NOT NULL DEFAULT '5',
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  `confirmation_code` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `accounts` (
  `account_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(255) unsigned NOT NULL,
  `amount` double NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE (`user_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `transactions` (
  `transaction_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(255) unsigned NOT NULL,
  `account_id` int(255) unsigned NOT NULL,
  `amount` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `tags` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending' NOT NULL,
  `date` datetime NOT NULL,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  UNIQUE (`user_id`,`amount`,`description`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


