-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: green-garden
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `garden_id` int NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `temperature` double NOT NULL,
  `humidity` double NOT NULL,
  `soil_moisture` double NOT NULL,
  `pump_status` tinyint(1) NOT NULL,
  `door_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `data_ibfk_1` (`garden_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data`
--

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;
INSERT INTO `data` VALUES (1,1,'00:00:12','2022-12-02',20.5,12.2,10.8,0,0),(2,1,'13:10:55','2022-12-04',21.1,10,8,0,0),(3,3,'06:55:02','2022-11-07',22,10,7,0,0),(4,2,'05:07:23','2022-11-21',23.8,18,7.7,0,0);
/*!40000 ALTER TABLE `data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garden`
--

DROP TABLE IF EXISTS `garden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `garden` (
  `id` int NOT NULL AUTO_INCREMENT,
  `manager_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `description` text NOT NULL,
  `tree_id` int NOT NULL,
  `AIO_Username` varchar(255) NOT NULL,
  `AIO_Key` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `manager_id` (`manager_id`),
  KEY `tree_id` (`tree_id`),
  CONSTRAINT `garden_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `user` (`id`),
  CONSTRAINT `garden_ibfk_2` FOREIGN KEY (`tree_id`) REFERENCES `tree` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garden`
--

LOCK TABLES `garden` WRITE;
/*!40000 ALTER TABLE `garden` DISABLE KEYS */;
INSERT INTO `garden` VALUES (1,1,'Garden of admin1','2022-11-26','The first garden',1,'nhom3cnpm','aio_qAgC39Ym1FzeE5lCzGgRwwyWRYVf'),(2,2,'Garden of admin2','2022-11-26','Garden of admin2',2,'aio_admin_name','aio_admin_key'),(3,3,'Garden of admin3','2022-10-20','First Garden of admin3',3,'aioadmin2name','aioadmin2key');
/*!40000 ALTER TABLE `garden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `read` tinyint(1) NOT NULL,
  `garden_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_ibfk_1` (`garden_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'Test','This is a test message',1,1);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phase`
--

DROP TABLE IF EXISTS `phase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phase` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tree_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `period` int NOT NULL,
  `high_threshold` double NOT NULL,
  `low_threshold` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tree_id` (`tree_id`),
  CONSTRAINT `phase_ibfk_1` FOREIGN KEY (`tree_id`) REFERENCES `tree` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phase`
--

LOCK TABLES `phase` WRITE;
/*!40000 ALTER TABLE `phase` DISABLE KEYS */;
INSERT INTO `phase` VALUES (1,1,'Nảy mầm',4,75,60),(2,1,'Cây con',19,65,55),(3,1,'Tăng trưởng',50,75,65),(4,1,'Trổ hoa',65,85,75),(5,1,'Kết trái',95,75,65),(6,1,'Thu hoạch',100,65,60),(7,2,'Hình thành cây',5,80,70),(8,2,'Sinh trưởng sớm',30,80,70),(9,2,'Sinh dưỡng',50,80,70),(10,2,'Tạo quả',80,80,70),(11,2,'Thu hoạch',90,70,60),(12,3,'Nảy mầm và cây con',20,80,70),(13,3,'Tăng trưởng nhanh',100,85,75),(14,3,'Thu hoạch',120,70,65),(15,4,'Nảy mầm',21,75,65),(16,4,'Hình thành cây',40,75,70),(17,4,'Sinh trưởng và tạo củ',70,80,70),(18,4,'Phình củ',110,85,75),(19,4,'Thu hoạch',150,70,60);
/*!40000 ALTER TABLE `phase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pump_threshold`
--

DROP TABLE IF EXISTS `pump_threshold`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pump_threshold` (
  `id` int NOT NULL AUTO_INCREMENT,
  `garden_id` int NOT NULL,
  `high_threshold` double DEFAULT NULL,
  `low_threshold` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `garden_id_idx` (`garden_id`),
  CONSTRAINT `garden_id` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`id`),
  CONSTRAINT `pump_threshold_ibfk_1` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pump_threshold`
--

LOCK TABLES `pump_threshold` WRITE;
/*!40000 ALTER TABLE `pump_threshold` DISABLE KEYS */;
INSERT INTO `pump_threshold` VALUES (1,1,75,65),(2,2,30,12),(3,3,25,17);
/*!40000 ALTER TABLE `pump_threshold` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tree`
--

DROP TABLE IF EXISTS `tree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tree` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `img_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tree`
--

LOCK TABLES `tree` WRITE;
/*!40000 ALTER TABLE `tree` DISABLE KEYS */;
INSERT INTO `tree` VALUES (1,'Ngô','https://raw.githubusercontent.com/theksbd/green-house/master/server/assets/corn.png'),(2,'Cà chua','https://raw.githubusercontent.com/theksbd/green-house/master/server/assets/tomato.png'),(3,'Bắp cải','https://raw.githubusercontent.com/theksbd/green-house/master/server/assets/cabbage.png'),(4,'Khoai tây','https://raw.githubusercontent.com/theksbd/green-house/master/server/assets/potato.png');
/*!40000 ALTER TABLE `tree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin1','123'),(2,'admin2','123'),(3,'admin3','123');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-16 22:56:34
