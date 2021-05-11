-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         5.7.24 - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para dbfacturacion
DROP DATABASE IF EXISTS `dbfacturacion`;
CREATE DATABASE IF NOT EXISTS `dbfacturacion` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `dbfacturacion`;

-- Volcando estructura para tabla dbfacturacion.batchs
DROP TABLE IF EXISTS `batchs`;
CREATE TABLE IF NOT EXISTS `batchs` (
  `bth_id` int(11) NOT NULL AUTO_INCREMENT,
  `bth_sended` varchar(10) NOT NULL,
  `cli_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`bth_id`),
  KEY `cli_id` (`cli_id`),
  CONSTRAINT `batchs_ibfk_1` FOREIGN KEY (`cli_id`) REFERENCES `clients` (`cli_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla dbfacturacion.batchs: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `batchs` DISABLE KEYS */;
REPLACE INTO `batchs` (`bth_id`, `bth_sended`, `cli_id`, `createdAt`, `updatedAt`) VALUES
	(1, 'false', 3, '2020-10-13 17:48:41', '2020-10-13 17:48:41');
/*!40000 ALTER TABLE `batchs` ENABLE KEYS */;

-- Volcando estructura para tabla dbfacturacion.clients
DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `cli_id` int(11) NOT NULL AUTO_INCREMENT,
  `cli_name` varchar(45) NOT NULL,
  PRIMARY KEY (`cli_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla dbfacturacion.clients: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
REPLACE INTO `clients` (`cli_id`, `cli_name`) VALUES
	(1, 'beval'),
	(2, 'febeca'),
	(3, 'sillaca');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;

-- Volcando estructura para tabla dbfacturacion.invoices
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `inv_id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_number` varchar(20) DEFAULT NULL,
  `inv_control_number` varchar(20) DEFAULT NULL,
  `inv_zone` varchar(45) DEFAULT NULL,
  `inv_seller` varchar(45) DEFAULT NULL,
  `inv_trip` varchar(45) DEFAULT NULL,
  `inv_ReleaseDate` date DEFAULT '2020-10-13',
  `cli_id` int(11) NOT NULL,
  `prt_id` int(11) DEFAULT NULL,
  `bth_id` int(11) NOT NULL,
  `file_route` varchar(45) DEFAULT NULL,
  `inv_sended` varchar(11) DEFAULT NULL,
  `inv_read_error` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`inv_id`),
  KEY `cli_id` (`cli_id`),
  KEY `prt_id` (`prt_id`),
  KEY `bth_id` (`bth_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`cli_id`) REFERENCES `clients` (`cli_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`prt_id`) REFERENCES `partners` (`prt_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`bth_id`) REFERENCES `batchs` (`bth_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla dbfacturacion.invoices: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
REPLACE INTO `invoices` (`inv_id`, `inv_number`, `inv_control_number`, `inv_zone`, `inv_seller`, `inv_trip`, `inv_ReleaseDate`, `cli_id`, `prt_id`, `bth_id`, `file_route`, `inv_sended`, `inv_read_error`) VALUES
	(1, 'A-01948469', NULL, NULL, NULL, NULL, '2020-10-13', 3, NULL, 1, NULL, NULL, 'true'),
	(2, 'A-01948470', NULL, NULL, NULL, NULL, '2020-10-13', 3, NULL, 1, NULL, NULL, 'true'),
	(3, 'A-01948468', '00-3391037', '124', '124', '6842011', '2020-09-14', 3, 1, 1, './tmp/pdf/pages/Sillaca-1602611252087-0.pdf', NULL, 'false'),
	(4, 'A-01948471', NULL, NULL, NULL, NULL, '2020-10-13', 3, NULL, 1, NULL, NULL, 'true'),
	(5, 'A-01948473', NULL, NULL, NULL, NULL, '2020-10-13', 3, NULL, 1, NULL, NULL, 'true'),
	(6, 'A-01948474', NULL, NULL, NULL, NULL, '2020-10-13', 3, NULL, 1, NULL, NULL, 'true'),
	(7, 'A-01948472', '00-3391041', '61', '61', '6842021', '2020-09-14', 3, 2, 1, './tmp/pdf/pages/Sillaca-1602611252087-1.pdf', NULL, 'false'),
	(8, 'A-01948475', '00-3391044', '61', '61', '6842021', '2020-09-14', 3, 3, 1, './tmp/pdf/pages/Sillaca-1602611252087-2.pdf', NULL, 'false');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;

-- Volcando estructura para tabla dbfacturacion.partners
DROP TABLE IF EXISTS `partners`;
CREATE TABLE IF NOT EXISTS `partners` (
  `prt_id` int(11) NOT NULL AUTO_INCREMENT,
  `prt_name` varchar(45) NOT NULL,
  `prt_email` varchar(45) NOT NULL,
  `prt_key` varchar(45) NOT NULL,
  PRIMARY KEY (`prt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla dbfacturacion.partners: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
REPLACE INTO `partners` (`prt_id`, `prt_name`, `prt_email`, `prt_key`) VALUES
	(1, 'INVERSIONES JESMAY 2906 C.A.', 'null', '0931059'),
	(2, '(FERRENAIGUATA)', 'null', '0145053'),
	(3, 'FERRETERIA EL PUERTO MARITIMO, C.A', 'mariarosanafv52@gmail.com', '2290625');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;

-- Volcando estructura para tabla dbfacturacion.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `usr_id` int(11) NOT NULL AUTO_INCREMENT,
  `usr_name` varchar(45) DEFAULT NULL,
  `usr_last_name` varchar(45) DEFAULT NULL,
  `usr_email` varchar(200) DEFAULT NULL,
  `usr_rol` varchar(45) DEFAULT NULL,
  `usr_status` varchar(45) DEFAULT NULL,
  `cli_id` int(11) NOT NULL,
  PRIMARY KEY (`usr_id`),
  KEY `cli_id` (`cli_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`cli_id`) REFERENCES `clients` (`cli_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla dbfacturacion.users: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
REPLACE INTO `users` (`usr_id`, `usr_name`, `usr_last_name`, `usr_email`, `usr_rol`, `usr_status`, `cli_id`) VALUES
	(1, 'Enmanuel', 'Leon', 'eleon@intelix.biz', '0', '0', 3),
	(2, 'Alejandro', 'Gonzalez', 'agonzalez@intelix.biz', '0', '0', 3),
	(3, 'Endrina', 'Toledo', 'etoledo@intelix.biz', '0', '0', 3),
	(4, 'Angel', 'Narvaez', 'anarvaez@intelix.biz', '0', '0', 3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

DROP TABLE IF EXISTS `email_readed`;
CREATE TABLE `email_readed` (
  `er_id` int NOT NULL AUTO_INCREMENT,
  `er_total_files` int DEFAULT NULL,
  `er_correctly` int DEFAULT NULL,
  `er_failed` int DEFAULT NULL,
  `er_date` datetime DEFAULT '2021-01-29 19:58:09',
  `cli_id` int NOT NULL,
  PRIMARY KEY (`er_id`),
  KEY `cli_id` (`cli_id`),
  CONSTRAINT `email_readed_ibfk_1` FOREIGN KEY (`cli_id`) REFERENCES `clients` (`cli_id`) ON UPDATE CASCADE
);

DROP TABLE IF EXISTS `email_details`;
CREATE TABLE `email_details` (
  `ef_id` int NOT NULL AUTO_INCREMENT,
  `ef_file_name` varchar(256) DEFAULT NULL,
  `ed_status` varchar(50) DEFAULT NULL,
  `ed_description` varchar(100) DEFAULT NULL,
  `ed_date` datetime DEFAULT '2021-01-29 19:58:09',
  `er_id` int NOT NULL,
  PRIMARY KEY (`ef_id`),
  KEY `er_id` (`er_id`),
  CONSTRAINT `email_details_ibfk_1` FOREIGN KEY (`er_id`) REFERENCES `email_readed` (`er_id`) ON UPDATE CASCADE
);