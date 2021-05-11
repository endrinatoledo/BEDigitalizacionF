INSERT INTO dbfacturacion.clients (cli_name) VALUES
	 ('beval'),
	 ('febeca'),
	 ('sillaca');
INSERT INTO dbfacturacion.users (usr_name,usr_last_name,usr_email,usr_rol,usr_status,usr_seller_code,cli_id) VALUES
	 ('Enmanuel','Leon','eleon@intelix.biz','0','0','52',2),
	 ('Angel','Narvaez','anarvaez@intelix.biz','0','0',NULL,3),
	 ('Alejandro','Gonzalez','agonzalez@intelix.biz','0','0',NULL,3),
	 ('Endrina','Toledo','etoledo@intelix.biz','0','0',NULL,3),
	 ('Prueba','Prueba','test@test.com','3','0',NULL,2),
	 ('Williams','Leon','wleon@intelix.biz','0','0',NULL,3),
	 ('Bernardo','Chirinos','bchirinos@mayoreo.biz','0','0',NULL,3);
INSERT INTO dbfacturacion.config (cfg_invoices_prefix,cfg_control_prefix,cfg_printer_email,cli_id) VALUES
	 ('A-','00-','anarvaez@intelix.biz',1),
	 ('A-','00-','agonzalez@intelix.biz',2),
	 ('A-','00-','eleon@intelix.biz',3);

SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));