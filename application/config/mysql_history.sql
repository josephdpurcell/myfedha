-- --------------------------------------------------------
-- mysql_history.sql
--
-- The chronicle of database changes.
-- --------------------------------------------------------

-- --------------------------------------------------------
-- Create Care Tables
-- April 7, 2012

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
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` double NOT NULL,
  `parent_id` int(255) unsigned DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `name` (`user_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `transactions` (
  `transaction_id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(255) unsigned NOT NULL,
  `amount` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `to_account_id` int(255) unsigned NOT NULL,
  `from_account_id` int(255) unsigned NOT NULL,
  `tags` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `date` datetime NOT NULL,
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `amount` (`user_id`,`amount`,`description`,`to_account_id`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

