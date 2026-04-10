-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: cooking_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` bigint NOT NULL AUTO_INCREMENT,
  `address_text` text,
  `label` varchar(50) DEFAULT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'23r32','ưda',0,0,2),(2,'123 HN','Hà nội',0,0,4);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imageUrl` text,
  `title` varchar(255) DEFAULT NULL,
  `subTitle` varchar(255) DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920','Hôm nay ăn gì?','Khám phá 1000+ công thức',1),(2,'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920','CookPad','Món ngon mỗi ngày',1),(3,'https://picsum.photos/800/400','Chào mừng Ninh tới CookPad','Khám phá công thức nấu ăn ngon mỗi ngày',1),(4,'https://picsum.photos/800/400','Chào mừng Ninh tới CookPad','Khám phá món ngon mỗi ngày',1);
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calories`
--

DROP TABLE IF EXISTS `calories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calories` (
  `food_name` varchar(255) DEFAULT NULL,
  `calories` int DEFAULT NULL,
  `unit` varchar(20) DEFAULT '100g'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calories`
--

LOCK TABLES `calories` WRITE;
/*!40000 ALTER TABLE `calories` DISABLE KEYS */;
/*!40000 ALTER TABLE `calories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` bigint NOT NULL AUTO_INCREMENT,
  `price_snapshot` bigint NOT NULL,
  `quantity` int NOT NULL,
  `cart_id` bigint NOT NULL,
  `dish_id` bigint NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FKdaescekp0k03m7t90duv70c03` (`dish_id`),
  CONSTRAINT `FKdaescekp0k03m7t90duv70c03` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`dish_id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,12341,1,1,1),(2,12341,3,2,1),(3,30000,9,3,2),(4,30000,1,4,2);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `status` enum('ACTIVE','CANCELLED','ORDERED') DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `seller_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FKb6tjpbdydynt291e6p43dt3yy` (`seller_id`),
  KEY `FKb5o626f86h46m4s7ms6ginnop` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKb6tjpbdydynt291e6p43dt3yy` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'2026-02-28 03:31:42.837988','ORDERED','2026-02-28 03:31:55.129702',1,2),(2,'2026-04-10 15:28:31.665992','ACTIVE','2026-04-10 15:28:31.665992',1,1),(3,'2026-04-10 16:23:18.690313','ORDERED','2026-04-10 16:23:35.641963',3,4),(4,'2026-04-10 17:56:57.648812','ORDERED','2026-04-10 17:57:03.619034',3,4);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`),
  UNIQUE KEY `UKoul14ho7bctbefv8jywp5v3i2` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Các món nhẹ đầu bữa','https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800','Món Khai Vị','mon-khai-vi'),(2,'Các món ăn giàu dinh dưỡng','https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800','Món Chính','mon-chinh'),(3,'Đồ ngọt và hoa quả','https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800','Tráng Miệng','trang-mieng');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chef_requests`
--

DROP TABLE IF EXISTS `chef_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chef_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_note` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt8lhyq4d58kvs3v8hf0p4fl53` (`user_id`),
  CONSTRAINT `FKt8lhyq4d58kvs3v8hf0p4fl53` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chef_requests`
--

LOCK TABLES `chef_requests` WRITE;
/*!40000 ALTER TABLE `chef_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `chef_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collection_recipes`
--

DROP TABLE IF EXISTS `collection_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collection_recipes` (
  `collection_recipe_id` bigint NOT NULL AUTO_INCREMENT,
  `added_at` datetime(6) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `collection_id` bigint NOT NULL,
  `recipe_id` bigint NOT NULL,
  PRIMARY KEY (`collection_recipe_id`),
  UNIQUE KEY `UKoy40ov9cf9f30p7enkoexc2rd` (`collection_id`,`recipe_id`),
  KEY `FKjhshxvrde3jpdwc0v1g1b3w9o` (`recipe_id`),
  CONSTRAINT `FKjhshxvrde3jpdwc0v1g1b3w9o` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `FKteylsehnd80fep5bldxj68xvw` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`collection_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_recipes`
--

LOCK TABLES `collection_recipes` WRITE;
/*!40000 ALTER TABLE `collection_recipes` DISABLE KEYS */;
INSERT INTO `collection_recipes` VALUES (1,'2026-04-10 16:22:52.616951',NULL,NULL,2,6);
/*!40000 ALTER TABLE `collection_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collections` (
  `collection_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_public` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`collection_id`),
  KEY `FKn7pdedyqaiddr0uxdj603my7d` (`user_id`),
  CONSTRAINT `FKn7pdedyqaiddr0uxdj603my7d` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collections`
--

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` VALUES (1,'2026-02-28 03:36:00.573613','32r32',_binary '','ewwrẻwrư','2026-02-28 03:36:00.573613',1),(2,'2026-04-10 16:22:45.069759','Muốn ăn cơm',_binary '','Cơm','2026-04-10 16:22:45.069759',4);
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `comment_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgu1pee3567af29uutdfy0fcjd` (`user_id`,`comment_id`),
  KEY `FK3wa5u7bs1p1o9hmavtgdgk1go` (`comment_id`),
  CONSTRAINT `FK3wa5u7bs1p1o9hmavtgdgk1go` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`),
  CONSTRAINT `FK6h3lbneryl5pyb9ykaju7werx` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  `recipe_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `FK7h839m3lkvhbyv3bcdv7sm4fj` (`parent_comment_id`),
  KEY `FKdtb5nfo2c69a6chahuihyaqx` (`recipe_id`),
  KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`),
  CONSTRAINT `FK7h839m3lkvhbyv3bcdv7sm4fj` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`),
  CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKdtb5nfo2c69a6chahuihyaqx` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'dư','2026-02-28 02:45:59.727294','2026-02-28 02:45:59.727294',NULL,2,2),(2,'Ko thích cơm thích phở','2026-04-10 16:20:48.906634','2026-04-10 16:20:48.906634',NULL,6,4),(3,'hi','2026-04-10 16:22:02.834112','2026-04-10 16:22:02.834112',NULL,6,4);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish`
--

DROP TABLE IF EXISTS `dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish` (
  `dish_id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `img_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` bigint DEFAULT NULL,
  `remaining_servings` bigint NOT NULL,
  `status` enum('ACTIVE','DISABLED','INACTIVE','OUT_OF_STOCK') NOT NULL,
  `version` bigint NOT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`dish_id`),
  KEY `FKsgrix043qhd4gush19ooyli9l` (`recipe_id`),
  KEY `FK4cvbymf9m9quckcouehn0p414` (`user_id`),
  CONSTRAINT `FK4cvbymf9m9quckcouehn0p414` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKsgrix043qhd4gush19ooyli9l` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish`
--

LOCK TABLES `dish` WRITE;
/*!40000 ALTER TABLE `dish` DISABLE KEYS */;
INSERT INTO `dish` VALUES (1,'','/static_resource/public/upload/dishs/6f518ead-4f07-47ff-8288-ca7b13f39683_OIP.webp','àw',12341,24,'ACTIVE',0,3,1),(2,'Món cơm chiên nhanh gọn, phù hợp ăn sáng hoặc tận dụng cơm nguội.\r\n','/static_resource/public/upload/dishs/8d90b399-4aab-4532-adc0-a7fd3593d3a1_cach-lam-com-chien-trung-hat-com-toi-khong-bi-nhao-202203031523399671.jpg','Cơm chiên trứng',30000,10,'ACTIVE',2,6,3);
/*!40000 ALTER TABLE `dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `featured_videos`
--

DROP TABLE IF EXISTS `featured_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `featured_videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `youtubeUrl` text,
  `thumbnail` text,
  `isActive` tinyint DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featured_videos`
--

LOCK TABLES `featured_videos` WRITE;
/*!40000 ALTER TABLE `featured_videos` DISABLE KEYS */;
INSERT INTO `featured_videos` VALUES (1,'Hướng dẫn làm Phở','https://www.youtube.com/watch?v=dQw4w9WgXcQ','https://picsum.photos/400/300',1,'2026-02-27 18:21:08');
/*!40000 ALTER TABLE `featured_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `calories` int DEFAULT NULL,
  `protein` float DEFAULT NULL,
  `fat` float DEFAULT NULL,
  `carb` float DEFAULT NULL,
  `serving_size` varchar(50) DEFAULT NULL,
  `image_url` text,
  `status` varchar(20) DEFAULT 'published',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,'Phở Bò',NULL,'Món nước',450,20,15,50,NULL,NULL,'published'),(2,'Cơm trắng',NULL,NULL,130,NULL,NULL,NULL,NULL,NULL,'published'),(3,'Bánh Mì',NULL,'Ăn sáng',250,NULL,NULL,NULL,NULL,NULL,'published'),(4,'Phở Bò',NULL,'Món chính',450,NULL,NULL,NULL,NULL,NULL,'published');
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `ingredient_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `normalized_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ingredient_id`),
  UNIQUE KEY `UKj6tsl15xx76y4kv41yxr4uxab` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'Bột mì','bot mi'),(2,'Bột nở','bot no'),(3,'Cà chua','ca chua'),(4,'Hành tây','hanh tay'),(5,'Mực','muc'),(6,'Bò','bo'),(7,'thịt gà','thit ga'),(8,'Gừng, tỏi, ớt','gung toi ot'),(9,'Bột ngọt, hạt nêm, muối, nước mắm, đường, tương ớt, nước màu, tiêu','bot ngot hat nem muoi nuoc mam uong tuong ot nuoc mau tieu'),(10,'Xương bò','xuong bo'),(11,'Thịt bò','thit bo'),(12,'Bánh phở','banh pho'),(13,'Gừng','gung'),(14,'Nước mắm','nuoc mam'),(15,'Cơm nguội','com nguoi'),(16,'Trứng','trung'),(17,'Hành lá','hanh la'),(18,'Dầu ăn','dau an');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `type` enum('COMMENT','FOLLOW','LIKE','MENTION','MESSAGE','RECIPE_APPROVED') NOT NULL,
  `actor_id` bigint DEFAULT NULL,
  `comment_id` bigint DEFAULT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `recipient_id` bigint NOT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `FK4sd9fik0uthbk6d9rsxco4uja` (`actor_id`),
  KEY `FKl7p8sj183bxuwg2sq2ltx3cpv` (`comment_id`),
  KEY `FK833y13288tdsq6r8xx47wrgqi` (`recipe_id`),
  KEY `FKqqnsjxlwleyjbxlmm213jaj3f` (`recipient_id`),
  CONSTRAINT `FK4sd9fik0uthbk6d9rsxco4uja` FOREIGN KEY (`actor_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK833y13288tdsq6r8xx47wrgqi` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `FKl7p8sj183bxuwg2sq2ltx3cpv` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`),
  CONSTRAINT `FKqqnsjxlwleyjbxlmm213jaj3f` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'Ninh đã bình luận về công thức của bạn: \"Bún Chả Hà Nội\"','2026-02-28 02:45:59.794901',_binary '\0','COMMENT',2,1,2,1),(2,'diepbanbua đã theo dõi bạn','2026-04-10 16:19:39.117111',_binary '\0','FOLLOW',4,NULL,NULL,3),(3,'diepbanbua đã bình luận về công thức của bạn: \"Cơm chiên trứng\"','2026-04-10 16:20:48.916763',_binary '\0','COMMENT',4,2,6,3),(4,'diepbanbua đã bình luận về công thức của bạn: \"Cơm chiên trứng\"','2026-04-10 16:22:02.840286',_binary '\0','COMMENT',4,3,6,3),(5,'diepbanbua đã thích công thức của bạn: \"Cơm chiên trứng\"','2026-04-10 16:23:09.560546',_binary '\0','LIKE',4,NULL,6,3);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `price_at_order` bigint NOT NULL,
  `quantity` int NOT NULL,
  `dish_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `FKa5ygw60crrnmser89852e8v77` (`dish_id`),
  KEY `FKhee9q71wp7l3ysceirtyojhb9` (`order_id`),
  CONSTRAINT `FKa5ygw60crrnmser89852e8v77` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`dish_id`),
  CONSTRAINT `FKhee9q71wp7l3ysceirtyojhb9` FOREIGN KEY (`order_id`) REFERENCES `product_orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,12341,1,1,2),(2,30000,9,2,9),(3,30000,1,2,10);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_type` varchar(31) NOT NULL,
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `order_info` varchar(255) DEFAULT NULL,
  `order_status` enum('CANCELLED_BY_BUYER','CANCELLED_BY_PAYMENT_FAIL','CANCELLED_BY_SELLER','COMPLETED','CONFIRMED_BY_SELLER','DELIVERED','PAID','PENDING_ACCOUNT_UPGRADE','SHIPPED','UNKOWN','WAITING_PAYMENT') NOT NULL,
  `total_amount` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `seller_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  KEY `FKsb9w6305d2be0rwbtifi7wymp` (`seller_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKsb9w6305d2be0rwbtifi7wymp` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('UPGRADE_CHEF',1,'2026-02-28 03:31:20.600371','Nang cap','PENDING_ACCOUNT_UPGRADE',150000,NULL,2,NULL),('PURCHASE_PRODUCT',2,'2026-02-28 03:31:55.095688','Thanh toán đơn hàng từ cart','WAITING_PAYMENT',12341,'2026-02-28 03:31:55.129702',2,1),('UPGRADE_CHEF',3,'2026-04-10 15:32:17.955168','Nang cap','PENDING_ACCOUNT_UPGRADE',400000,NULL,3,NULL),('UPGRADE_CHEF',4,'2026-04-10 15:43:23.508538','Nang cap','PENDING_ACCOUNT_UPGRADE',400000,NULL,3,NULL),('UPGRADE_CHEF',5,'2026-04-10 15:45:21.073844','Nang cap','PENDING_ACCOUNT_UPGRADE',400000,NULL,3,NULL),('UPGRADE_CHEF',6,'2026-04-10 15:47:51.546396','Nang cap','PENDING_ACCOUNT_UPGRADE',400000,NULL,3,NULL),('UPGRADE_CHEF',7,'2026-04-10 15:51:45.786029','Nang cap','COMPLETED',400000,'2026-04-10 15:54:17.315386',3,NULL),('UPGRADE_CHEF',8,'2026-04-10 16:18:55.356010','Nang cap','COMPLETED',150000,'2026-04-10 16:19:33.289574',4,NULL),('PURCHASE_PRODUCT',9,'2026-04-10 16:23:35.587671','Thanh toán đơn hàng từ cart','COMPLETED',270000,'2026-04-10 18:00:25.435189',4,3),('PURCHASE_PRODUCT',10,'2026-04-10 17:57:03.602734','Thanh toán đơn hàng từ cart','COMPLETED',30000,'2026-04-10 18:00:26.388350',4,3);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outbox_events`
--

DROP TABLE IF EXISTS `outbox_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbox_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aggregate_id` bigint DEFAULT NULL,
  `aggregate_type` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `event_type` varchar(255) DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `processed` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outbox_events`
--

LOCK TABLES `outbox_events` WRITE;
/*!40000 ALTER TABLE `outbox_events` DISABLE KEYS */;
INSERT INTO `outbox_events` VALUES (1,3,'RECIPE','2026-02-28 03:27:42.704311','RECIPE_CREATED','{\"steps\": \"1: faegưagưge,2: ácvbedbsfdb\", \"title\": \"Pizza\", \"imageUrl\": \"/static_resource/public/upload/recipes/d186ecf4-fda2-4450-85c9-750507bd158b_OIP.webp\", \"description\": \"Đồ Ý\", \"ingredients\": \"Bột mì, Bột nở, Cà chua, Hành tây, Mực, Bò\"}',_binary ''),(2,4,'RECIPE','2026-04-10 15:58:01.799060','RECIPE_CREATED','{\"steps\": \"1: Bước 1 Sơ chế thịt gà cho sạch và chặt thành từng cục vừa ăn. Gừng cạo sạch vỏ và thái sợi.\\r\\n,2: Bước 2Ướp thịt gà trong một cái tô cùng với một ít bột ngọt, hạt nêm, muối, nước mắm, đường, tương ớt, nước màu trong 10 -15 phút.\\r\\n,3: Bước 3 Bắt nồi lên bếp, phi vàng tỏi rồi cho thịt gà đã ướp vào nấu trong 2 phút cho thêm nước lọc vào vừa ngập thịt gà. Tiếp tục nấu trong khoảng 20 phút ở lửa vừa, nêm nếm lại cho vừa ăn rồi cho gừng và tiêu vào hoàn thành món ăn.\\r\\n\", \"title\": \"Gà kho gừng\", \"imageUrl\": \"/static_resource/public/upload/recipes/8be9c9fc-d46d-43a0-aca9-f54744cab930_tong-hop-cong-thuc-nau-an-theo-cach-che-bien-de-lam-tai-nha-202112241205239944.jpg\", \"description\": \"Gà là một nguyên liệu chế biến thức ăn được nhiều người ưa thích. Một trong 10 món gà kho ngon, bà nội trợ không thể bỏ qua thì món gà kho gừng luôn được ưu tiên số 1 và thường thấy nhất trong các bữa cơm gia đình.\", \"ingredients\": \"thịt gà, Gừng, tỏi, ớt, Bột ngọt, hạt nêm, muối, nước mắm, đường, tương ớt, nước màu, tiêu\"}',_binary ''),(3,5,'RECIPE','2026-04-10 16:04:18.982540','RECIPE_CREATED','{\"steps\": \"1: Chần xương bò qua nước sôi 5 phút để loại bỏ tạp chất,2: Hầm xương bò với 3 lít nước trong 3–6 giờ\\r\\n,3: Nướng gừng và hành tây, sau đó cho vào nồi nước dùng\\r\\n\", \"title\": \"Phở bò\", \"imageUrl\": \"/static_resource/public/upload/recipes/518c54b2-b384-47b4-8831-cbe06ec52a2d_Pho-bo-Ha-Noi-7-vnexpress-1763-7388-9585-1763372391.jpg\", \"description\": \"👉 Phở bò truyền thống Việt Nam với nước dùng hầm từ xương bò đậm đà, thơm mùi quế hồi, ăn kèm bánh phở mềm và thịt bò tươi.\", \"ingredients\": \"Xương bò, Thịt bò, Bánh phở, Gừng, Nước mắm, Hành tây\"}',_binary ''),(4,6,'RECIPE','2026-04-10 16:10:36.487077','RECIPE_CREATED','{\"steps\": \"1: Bước 1: Phi hành với dầu\\r\\n,2: Bước 2: Đập trứng, đảo đều\\r\\n,3: Bước 3: Cho cơm vào đảo\\r\\n,4: Bước 4: Nêm gia vị, thêm hành\\r\\n,5: ,6: \", \"title\": \"Cơm chiên trứng\", \"imageUrl\": \"/static_resource/public/upload/recipes/9efac268-132f-4c26-9a1d-b1f0ea9f5d78_cach-lam-com-chien-trung-hat-com-toi-khong-bi-nhao-202203031523399671.jpg\", \"description\": \"Món cơm chiên nhanh gọn, phù hợp ăn sáng hoặc tận dụng cơm nguội.\", \"ingredients\": \"Cơm nguội, Trứng, Hành lá, Nước mắm, Dầu ăn\"}',_binary '');
/*!40000 ALTER TABLE `outbox_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages_upgrades`
--

DROP TABLE IF EXISTS `packages_upgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages_upgrades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `duration_days` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages_upgrades`
--

LOCK TABLES `packages_upgrades` WRITE;
/*!40000 ALTER TABLE `packages_upgrades` DISABLE KEYS */;
INSERT INTO `packages_upgrades` VALUES (1,'Full access 1 tháng cho CHEF',30,'CHEF 1 Month',150000),(2,'Full access 3 tháng cho CHEF',90,'CHEF 3 Months',400000);
/*!40000 ALTER TABLE `packages_upgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_orders`
--

DROP TABLE IF EXISTS `payment_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` bigint NOT NULL,
  `bank_code` varchar(255) DEFAULT NULL,
  `card_type` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_status` enum('FAILED','PENDING','PROCESSING','SUCCESS') NOT NULL,
  `response_code` varchar(255) DEFAULT NULL,
  `transaction_status` varchar(255) DEFAULT NULL,
  `txn_ref` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `vnpay_transaction_no` varchar(255) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq4yaosnnqxmmurxld644v30iv` (`txn_ref`),
  KEY `FKohtixrr5nsywabsqddlhdmx78` (`order_id`),
  CONSTRAINT `FKohtixrr5nsywabsqddlhdmx78` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_orders`
--

LOCK TABLES `payment_orders` WRITE;
/*!40000 ALTER TABLE `payment_orders` DISABLE KEYS */;
INSERT INTO `payment_orders` VALUES (1,150000,NULL,NULL,'2026-02-28 03:31:20.655203',NULL,'PENDING',NULL,NULL,'17722242806373890',NULL,NULL,1),(2,12341,NULL,NULL,'2026-02-28 03:31:55.124713',NULL,'PENDING',NULL,NULL,'17722243151186184',NULL,NULL,2),(3,400000,NULL,NULL,'2026-04-10 15:32:17.967953',NULL,'PENDING',NULL,NULL,'17758099379619051',NULL,NULL,3),(4,400000,NULL,NULL,'2026-04-10 15:43:23.549868',NULL,'PENDING',NULL,NULL,'17758106035371673',NULL,NULL,4),(5,400000,NULL,NULL,'2026-04-10 15:45:21.090921',NULL,'PENDING',NULL,NULL,'17758107210841421',NULL,NULL,5),(6,400000,NULL,NULL,'2026-04-10 15:47:51.593869',NULL,'PENDING',NULL,NULL,'17758108715780822',NULL,NULL,6),(7,400000,'NCB','ATM','2026-04-10 15:51:45.806229','2026-04-10 15:54:17.338545','SUCCESS','00','00','17758111057982444','2026-04-10 15:54:17.339054','15491469',7),(8,150000,'NCB','ATM','2026-04-10 16:18:55.364658','2026-04-10 16:19:33.296456','SUCCESS','00','00','17758127353606364','2026-04-10 16:19:33.297456','15491514',8),(9,270000,'NCB','ATM','2026-04-10 16:23:35.620698','2026-04-10 16:24:20.567866','SUCCESS','00','00','17758130156138063','2026-04-10 16:24:20.569415','15491526',9),(10,30000,'NCB','ATM','2026-04-10 17:57:03.614868','2026-04-10 17:57:28.094949','SUCCESS','00','00','17758186236129146','2026-04-10 17:57:28.095955','15491701',10);
/*!40000 ALTER TABLE `payment_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_orders`
--

DROP TABLE IF EXISTS `product_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_orders` (
  `shipping_note` varchar(255) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `address_id` bigint NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FKa11nm51h68liytkaw8uvfmq4j` (`address_id`),
  CONSTRAINT `FK9i0hwhyugrqsnrxstrq6n9sqb` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKa11nm51h68liytkaw8uvfmq4j` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_orders`
--

LOCK TABLES `product_orders` WRITE;
/*!40000 ALTER TABLE `product_orders` DISABLE KEYS */;
INSERT INTO `product_orders` VALUES (NULL,2,1),(NULL,9,2),(NULL,10,2);
/*!40000 ALTER TABLE `product_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_category`
--

DROP TABLE IF EXISTS `recipe_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_category` (
  `recipe_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`recipe_id`,`category_id`),
  KEY `FKjyw23gw8clntghakfe92qvrhm` (`category_id`),
  CONSTRAINT `FKjyw23gw8clntghakfe92qvrhm` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `FKm7277epjcd3or9ss6sbi03wh4` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_category`
--

LOCK TABLES `recipe_category` WRITE;
/*!40000 ALTER TABLE `recipe_category` DISABLE KEYS */;
INSERT INTO `recipe_category` VALUES (5,1),(3,2),(4,2),(6,2);
/*!40000 ALTER TABLE `recipe_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_daily_views`
--

DROP TABLE IF EXISTS `recipe_daily_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_daily_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `view_count` bigint NOT NULL,
  `view_date` date NOT NULL,
  `recipe_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKijelvpilmnbqqebvtdehp9j0t` (`recipe_id`,`view_date`),
  CONSTRAINT `FKrpee89ioyqsbfjsuaditlv0dx` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_daily_views`
--

LOCK TABLES `recipe_daily_views` WRITE;
/*!40000 ALTER TABLE `recipe_daily_views` DISABLE KEYS */;
INSERT INTO `recipe_daily_views` VALUES (1,13,'2026-02-28',2),(2,9,'2026-02-28',1),(3,6,'2026-02-28',3),(4,2,'2026-04-10',2),(5,2,'2026-04-10',1),(6,2,'2026-04-10',4),(7,4,'2026-04-10',5),(8,13,'2026-04-10',6);
/*!40000 ALTER TABLE `recipe_daily_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredients`
--

DROP TABLE IF EXISTS `recipe_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredients` (
  `recipe_ingredient_id` bigint NOT NULL AUTO_INCREMENT,
  `display_order` int NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `quantity` float DEFAULT NULL,
  `raw_name` varchar(255) NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `ingredient_id` bigint NOT NULL,
  `recipe_id` bigint NOT NULL,
  PRIMARY KEY (`recipe_ingredient_id`),
  KEY `FKgukrw6na9f61kb8djkkuvyxy8` (`ingredient_id`),
  KEY `FKcqlw8sor5ut10xsuj3jnttkc` (`recipe_id`),
  CONSTRAINT `FKcqlw8sor5ut10xsuj3jnttkc` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `FKgukrw6na9f61kb8djkkuvyxy8` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredients`
--

LOCK TABLES `recipe_ingredients` WRITE;
/*!40000 ALTER TABLE `recipe_ingredients` DISABLE KEYS */;
INSERT INTO `recipe_ingredients` VALUES (1,1,'',500,'Bột mì','g',1,3),(2,2,'',200,'Bột nở','g',2,3),(3,3,'',4,'Cà chua','quả',3,3),(4,4,'',4,'Hành tây','củ',4,3),(5,5,'',500,'Mực','g',5,3),(6,6,'',600,'Bò','g',6,3),(7,1,NULL,24,'Cà chua','quả',3,2),(8,1,'',500,'thịt gà','g',7,4),(9,2,'',NULL,'Gừng, tỏi, ớt','',8,4),(10,3,'',NULL,'Bột ngọt, hạt nêm, muối, nước mắm, đường, tương ớt, nước màu, tiêu','',9,4),(11,1,'hầm nước dùng',1500,'Xương bò','g',10,5),(12,2,'thái mỏng',500,'Thịt bò','g',11,5),(13,3,'',1000,'Bánh phở','g',12,5),(14,4,'nướng',NULL,'Gừng','g',13,5),(15,5,'',30,'Nước mắm','ml',14,5),(16,6,'',100,'Hành tây','g',4,5),(17,1,'',500,'Cơm nguội','g',15,6),(18,2,'',3,'Trứng','quả',16,6),(19,3,'',50,'Hành lá','g',17,6),(20,4,'',15,'Nước mắm','ml',14,6),(21,5,'',20,'Dầu ăn','ml',18,6);
/*!40000 ALTER TABLE `recipe_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_likes`
--

DROP TABLE IF EXISTS `recipe_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `recipe_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1u6kg3g0ve2mg61i7n0ctb1eo` (`user_id`,`recipe_id`),
  KEY `FK123rwitbkijue4y39x2a9pqqb` (`recipe_id`),
  CONSTRAINT `FK123rwitbkijue4y39x2a9pqqb` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `FK3h43xv6xr4dr42hpl8xym711d` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_likes`
--

LOCK TABLES `recipe_likes` WRITE;
/*!40000 ALTER TABLE `recipe_likes` DISABLE KEYS */;
INSERT INTO `recipe_likes` VALUES (1,'2026-04-10 16:23:09.554471',6,4);
/*!40000 ALTER TABLE `recipe_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_search_index`
--

DROP TABLE IF EXISTS `recipe_search_index`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_search_index` (
  `recipe_id` bigint NOT NULL,
  `search_text` longtext,
  PRIMARY KEY (`recipe_id`),
  CONSTRAINT `FKivdcs8i4lpyfjseedcvma4w8h` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_search_index`
--

LOCK TABLES `recipe_search_index` WRITE;
/*!40000 ALTER TABLE `recipe_search_index` DISABLE KEYS */;
INSERT INTO `recipe_search_index` VALUES (3,'Pizza Đồ Ý Món Chính Bột mì  Bột nở  Cà chua  Hành tây  Mực  Bò'),(4,'Gà kho gừng Gà là một nguyên liệu chế biến thức ăn được nhiều người ưa thích. Một trong 10 món gà kho ngon, bà nội trợ không thể bỏ qua thì món gà kho gừng luôn được ưu tiên số 1 và thường thấy nhất trong các bữa cơm gia đình. Món Chính thịt gà  Gừng, tỏi, ớt  Bột ngọt, hạt nêm, muối, nước mắm, đường, tương ớt, nước màu, tiêu'),(5,'Phở bò 👉 Phở bò truyền thống Việt Nam với nước dùng hầm từ xương bò đậm đà, thơm mùi quế hồi, ăn kèm bánh phở mềm và thịt bò tươi. Món Khai Vị Xương bò hầm nước dùng Thịt bò thái mỏng Bánh phở  Gừng nướng Nước mắm  Hành tây'),(6,'Cơm chiên trứng Món cơm chiên nhanh gọn, phù hợp ăn sáng hoặc tận dụng cơm nguội. Món Chính Cơm nguội  Trứng  Hành lá  Nước mắm  Dầu ăn');
/*!40000 ALTER TABLE `recipe_search_index` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_tag`
--

DROP TABLE IF EXISTS `recipe_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_tag` (
  `recipe_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`recipe_id`,`tag_id`),
  KEY `FKgacff6kvp9yp5363hebxsntfq` (`tag_id`),
  CONSTRAINT `FK8gpobc1topymhoqthe19ncagh` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `FKgacff6kvp9yp5363hebxsntfq` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_tag`
--

LOCK TABLES `recipe_tag` WRITE;
/*!40000 ALTER TABLE `recipe_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_views`
--

DROP TABLE IF EXISTS `recipe_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `viewed_at` datetime(6) NOT NULL,
  `recipe_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg1qsmulxsv8o07mw5enb498dv` (`recipe_id`,`user_id`),
  KEY `FKqk9lqm4jmd9rylxa32msy43c8` (`user_id`),
  CONSTRAINT `FK5fn9ynbjpapup4r3267tf92kp` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `FKqk9lqm4jmd9rylxa32msy43c8` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_views`
--

LOCK TABLES `recipe_views` WRITE;
/*!40000 ALTER TABLE `recipe_views` DISABLE KEYS */;
INSERT INTO `recipe_views` VALUES (1,'2026-04-10 15:28:28.759532',2,1),(2,'2026-02-28 03:29:56.536443',1,1),(3,'2026-02-28 02:46:06.596836',2,2),(4,'2026-02-28 03:33:50.947133',3,1),(5,'2026-02-28 03:31:37.435922',3,2),(6,'2026-04-10 15:31:17.777564',1,3),(7,'2026-04-10 15:58:20.227244',4,3),(8,'2026-04-10 16:04:49.759366',5,3),(9,'2026-04-10 16:14:31.556179',6,3),(10,'2026-04-10 17:56:54.271123',6,4);
/*!40000 ALTER TABLE `recipe_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `recipe_id` bigint NOT NULL AUTO_INCREMENT,
  `cook_time` bigint NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `difficulty` enum('EASY','HARD','MEDIUM','VERY_EASY','VERY_HARD') NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `prep_time` bigint NOT NULL,
  `scope` enum('DRAFT','PRIVATE','PUBLIC') NOT NULL,
  `servings` bigint NOT NULL,
  `status` enum('APPROVED','DELETED','PENDING','REJECTED') NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `views` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`recipe_id`),
  KEY `FKlc3x6yty3xsupx80hqbj9ayos` (`user_id`),
  CONSTRAINT `FKlc3x6yty3xsupx80hqbj9ayos` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,180,'2026-02-28 00:48:02.000000','Phở bò Nam Định gia truyền thơm nức mũi','MEDIUM','https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',30,'PUBLIC',4,'APPROVED','Phở Bò Nam Định','2026-02-28 00:48:02.000000','https://youtube.com/demo1',11,1),(2,20,'2026-02-28 00:48:02.000000','Bún chả Hà Nội thịt nướng thơm lừng','EASY','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',45,'PUBLIC',2,'APPROVED','Bún Chả Hà Nội','2026-02-28 00:48:02.000000','https://youtube.com/demo2',15,1),(3,30,'2026-02-28 03:27:42.558021','Đồ Ý','EASY','/static_resource/public/upload/recipes/d186ecf4-fda2-4450-85c9-750507bd158b_OIP.webp',50,'PUBLIC',2,'APPROVED','Pizza','2026-02-28 03:27:42.558021',NULL,6,1),(4,30,'2026-04-10 15:58:01.772121','Gà là một nguyên liệu chế biến thức ăn được nhiều người ưa thích. Một trong 10 món gà kho ngon, bà nội trợ không thể bỏ qua thì món gà kho gừng luôn được ưu tiên số 1 và thường thấy nhất trong các bữa cơm gia đình.','EASY','/static_resource/public/upload/recipes/8be9c9fc-d46d-43a0-aca9-f54744cab930_tong-hop-cong-thuc-nau-an-theo-cach-che-bien-de-lam-tai-nha-202112241205239944.jpg',10,'PUBLIC',2,'APPROVED','Gà kho gừng','2026-04-10 15:58:01.772121',NULL,2,3),(5,180,'2026-04-10 16:04:18.964908','👉 Phở bò truyền thống Việt Nam với nước dùng hầm từ xương bò đậm đà, thơm mùi quế hồi, ăn kèm bánh phở mềm và thịt bò tươi.','EASY','/static_resource/public/upload/recipes/518c54b2-b384-47b4-8831-cbe06ec52a2d_Pho-bo-Ha-Noi-7-vnexpress-1763-7388-9585-1763372391.jpg',20,'PUBLIC',2,'APPROVED','Phở bò','2026-04-10 16:04:18.964908',NULL,4,3),(6,10,'2026-04-10 16:10:36.456502','Món cơm chiên nhanh gọn, phù hợp ăn sáng hoặc tận dụng cơm nguội.','EASY','/static_resource/public/upload/recipes/9efac268-132f-4c26-9a1d-b1f0ea9f5d78_cach-lam-com-chien-trung-hat-com-toi-khong-bi-nhao-202203031523399671.jpg',10,'PUBLIC',2,'APPROVED','Cơm chiên trứng','2026-04-10 16:10:36.456502','/static_resource/public/upload/recipe_videos/0858a741-053b-4a4e-abd2-de4189801c3b_Tp_12__Hng_Dn_Cm_Chin_Trng_Kiu_Ny_n_Ch_C_Ghin_-_Chef_Hoshi_Phan_-_480p.mp4',13,3);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expires_at` datetime(6) DEFAULT NULL,
  `issued_at` datetime(6) DEFAULT NULL,
  `token_hash` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjtx87i0jvq2svedphegvdwcuy` (`user_id`),
  CONSTRAINT `FKjtx87i0jvq2svedphegvdwcuy` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (1,'2037-07-26 16:28:19.248766','2026-02-28 00:28:19.248766','12a28e7307947165220723aebe44e7098b47754450fe3a08a13cec371190aea2',2),(2,'2037-07-26 16:35:53.323487','2026-02-28 00:35:53.322272','3b8e43466975feb30b2148f45a4fbd0e1b24e843c3f23a2156deed2099dddd33',2),(3,'2037-07-26 16:36:02.557122','2026-02-28 00:36:02.557122','00e176536b1d18dd37d85841de0105f1649c55e94fca32df0d300088a2131de3',1),(4,'2037-07-26 16:55:02.518743','2026-02-28 00:55:02.518743','7e897979ee5048bafa8336734a6c2067cc5be0310a655d4df48598983066c548',1),(5,'2037-07-26 17:47:02.970807','2026-02-28 01:47:02.970807','cb8152e702769eafca30192608e11ab8b5804c9c00186bf1b949e51587ae0277',1),(6,'2037-07-26 18:22:51.477975','2026-02-28 02:22:51.477975','3caeb9fd8aea8a828d559c33a7aa5629f256d6742790477ed30f138e8615e2a0',1),(7,'2037-07-26 18:43:04.177594','2026-02-28 02:43:04.177594','007b402a8b775d25fe384d41ecb3f21bf1facd056ce5d6efa46439e1fcfc0e0f',2),(8,'2037-07-26 18:43:40.528917','2026-02-28 02:43:40.528917','43d1288ca894036fe06ce50591b57abbd3dbe93292834af181890ee17fe2daab',1),(9,'2037-07-26 18:45:51.144564','2026-02-28 02:45:51.144564','aba80991632989cd9a1baeaa2b08d616d8589bc6875fdbf0db3fa0b165801b44',2),(10,'2037-07-26 18:46:17.689006','2026-02-28 02:46:17.689006','8ff85844e3dfe5a8c33dc9a2d015b2a53d40206aada2b7fc3ef861d17532bcd5',1),(11,'2037-07-26 19:23:37.050608','2026-02-28 03:23:37.050608','712ac710bff86208a77a08aa6919a4152d3d1e91491bad55436698e1655077aa',1),(12,'2037-07-26 19:31:05.778905','2026-02-28 03:31:05.778905','5691965d4c6e07c7bc1504caf72ea1d03ce05a7a8cfba7a0c144cd56f1a72948',2),(13,'2037-07-26 19:32:34.019458','2026-02-28 03:32:34.019458','0d1c4fdc95523789e39c1ae6759b77249bb357569386ebd01e37379f9ef2f0d8',1),(14,'2037-09-06 07:30:26.894319','2026-04-10 15:30:26.894319','c807fc09184354a5eedb796e6bf97338f5d671a419cec55855973bbbc07af61a',3),(15,'2037-09-06 07:45:14.874934','2026-04-10 15:45:14.874934','baf9bdad6440f5431cff338fbbd81d1a2b1a90277d9de6dd7f6804c59732c329',3),(16,'2037-09-06 07:51:42.884630','2026-04-10 15:51:42.884630','09278db64b17e137e279cb42965c8b2c5cb8cdacf94e7fe86cd89f1ea9b81d38',3),(17,'2037-09-06 08:18:08.465594','2026-04-10 16:18:08.465594','a3ecdb7d263ebbfe43f89c956910a3c43988169e248f7214394a5eaa513e2a1c',4),(18,'2037-09-06 08:25:09.615153','2026-04-10 16:25:09.615153','63bcb233a09f2e7911e171a92a0ca97464df01c6153e2af17b96d946abfc59fe',3),(19,'2037-09-06 08:26:40.614380','2026-04-10 16:26:40.614380','7930e6114240b42fff1c613789f5e61509903fac370fa402d1e889679a3d4a75',4),(20,'2037-09-06 08:27:23.435794','2026-04-10 16:27:23.435794','f185db86cb22d84543b55cd4fb70680be91d314f6de9bffdc2a958f14640d42c',3),(21,'2037-09-06 08:28:28.694149','2026-04-10 16:28:28.694149','3b645ad5c25c019754e0ab0390fcb05280bbbc26fe3348bddc19565457f80ab1',1),(22,'2037-09-06 09:54:24.670461','2026-04-10 17:54:24.670461','8770e3a0234be0b7d99eafeab07aa92756069ba08540610373ecd0bf31f68b10',4),(23,'2037-09-06 09:55:05.776843','2026-04-10 17:55:05.776843','0cd7e719f7d64c44b5b302c8498e150453b6e14acad5e9b521c2efe17b232fd7',3),(24,'2037-09-06 09:56:37.032569','2026-04-10 17:56:37.032569','633ddeae09d95c17fc89e5bbfc1c3b09a7d8196e5ae41a3fd3e13bac171a11bd',4);
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (4,'ADMIN'),(2,'CHEF'),(3,'SELLER'),(1,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seller_wallet`
--

DROP TABLE IF EXISTS `seller_wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seller_wallet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_balance` bigint NOT NULL,
  `pending_balance` bigint NOT NULL,
  `seller_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpy8w8ov6h5l86c7ohg6xqrybr` (`seller_id`),
  CONSTRAINT `FK8lq2vxmvr8u24xxti8qtd66m1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seller_wallet`
--

LOCK TABLES `seller_wallet` WRITE;
/*!40000 ALTER TABLE `seller_wallet` DISABLE KEYS */;
INSERT INTO `seller_wallet` VALUES (1,269730,0,3),(2,0,0,4);
/*!40000 ALTER TABLE `seller_wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `step_images`
--

DROP TABLE IF EXISTS `step_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `step_images` (
  `step_id` bigint NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  KEY `FKkselvdxjudxwto1eunc6aeulq` (`step_id`),
  CONSTRAINT `FKkselvdxjudxwto1eunc6aeulq` FOREIGN KEY (`step_id`) REFERENCES `steps` (`step_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `step_images`
--

LOCK TABLES `step_images` WRITE;
/*!40000 ALTER TABLE `step_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `step_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `steps`
--

DROP TABLE IF EXISTS `steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `steps` (
  `step_id` bigint NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `step_number` int NOT NULL,
  `step_time` bigint DEFAULT NULL,
  `recipe_id` bigint NOT NULL,
  PRIMARY KEY (`step_id`),
  KEY `FK729dw6qpupm85tlbq57rqbpru` (`recipe_id`),
  CONSTRAINT `FK729dw6qpupm85tlbq57rqbpru` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `steps`
--

LOCK TABLES `steps` WRITE;
/*!40000 ALTER TABLE `steps` DISABLE KEYS */;
INSERT INTO `steps` VALUES (1,'faegưagưge',1,20,3),(2,'ácvbedbsfdb',2,34,3),(3,'Bước 1 Sơ chế thịt gà cho sạch và chặt thành từng cục vừa ăn. Gừng cạo sạch vỏ và thái sợi.\r\n',1,0,4),(4,'Bước 2Ướp thịt gà trong một cái tô cùng với một ít bột ngọt, hạt nêm, muối, nước mắm, đường, tương ớt, nước màu trong 10 -15 phút.\r\n',2,0,4),(5,'Bước 3 Bắt nồi lên bếp, phi vàng tỏi rồi cho thịt gà đã ướp vào nấu trong 2 phút cho thêm nước lọc vào vừa ngập thịt gà. Tiếp tục nấu trong khoảng 20 phút ở lửa vừa, nêm nếm lại cho vừa ăn rồi cho gừng và tiêu vào hoàn thành món ăn.\r\n',3,0,4),(6,'Chần xương bò qua nước sôi 5 phút để loại bỏ tạp chất',1,5,5),(7,'Hầm xương bò với 3 lít nước trong 3–6 giờ\r\n',2,180,5),(8,'Nướng gừng và hành tây, sau đó cho vào nồi nước dùng\r\n',3,10,5),(9,'Bước 1: Phi hành với dầu\r\n',1,2,6),(10,'Bước 2: Đập trứng, đảo đều\r\n',2,2,6),(11,'Bước 3: Cho cơm vào đảo\r\n',3,5,6),(12,'Bước 4: Nêm gia vị, thêm hành\r\n',4,1,6),(13,'',5,0,6),(14,'',6,0,6);
/*!40000 ALTER TABLE `steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt48xdq560gs3gap9g7jg36kgc` (`name`),
  UNIQUE KEY `UKsn0d91hxu700qcw0n4pebp5vc` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upgrade_orders`
--

DROP TABLE IF EXISTS `upgrade_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upgrade_orders` (
  `package_duration_days` int NOT NULL,
  `role_assigned` varchar(255) NOT NULL,
  `order_id` bigint NOT NULL,
  `package_upgrade_id` bigint NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FK46qay52na598kifvbpcwddb1` (`package_upgrade_id`),
  CONSTRAINT `FK46qay52na598kifvbpcwddb1` FOREIGN KEY (`package_upgrade_id`) REFERENCES `packages_upgrades` (`id`),
  CONSTRAINT `FKc1nf7iyen6t3pa346kugqnklc` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upgrade_orders`
--

LOCK TABLES `upgrade_orders` WRITE;
/*!40000 ALTER TABLE `upgrade_orders` DISABLE KEYS */;
INSERT INTO `upgrade_orders` VALUES (30,'CHEF',1,1),(90,'CHEF',3,2),(90,'CHEF',4,2),(90,'CHEF',5,2),(90,'CHEF',6,2),(90,'CHEF',7,2),(30,'CHEF',8,1);
/*!40000 ALTER TABLE `upgrade_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_follows`
--

DROP TABLE IF EXISTS `user_follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_follows` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `followed_id` bigint NOT NULL,
  `follower_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt21sqiubk1nu5epc9yieinc6h` (`follower_id`,`followed_id`),
  KEY `FKea4yg0iwonducxlnqqdjmdh4j` (`followed_id`),
  CONSTRAINT `FKea4yg0iwonducxlnqqdjmdh4j` FOREIGN KEY (`followed_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKqx9mu1fniaua5jfe1cdyspxdt` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_follows`
--

LOCK TABLES `user_follows` WRITE;
/*!40000 ALTER TABLE `user_follows` DISABLE KEYS */;
INSERT INTO `user_follows` VALUES (1,'2026-04-10 16:19:39.103069',3,4);
/*!40000 ALTER TABLE `user_follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(2,1),(3,1),(4,1),(1,2),(3,2),(4,2),(1,4);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('ACTIVE','BANNED','INACTIVE') NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,NULL,'2026-02-27 23:20:02.317124','1990-01-01','admin','2026-04-10 16:28:28.685135','$2a$10$54izXhXVRXubeNjUTQvT/uJG0jF.HRxuX20blhorpT/ow7V7ArtlC','ACTIVE','admin'),(2,'/static_resource/public/upload/avatars/avatar_holder.png','ìaợtnagi','2026-02-28 00:28:08.975589','1985-02-12','ninh@test.com','2026-02-28 03:31:05.761993','$2a$10$54izXhXVRXubeNjUTQvT/uJG0jF.HRxuX20blhorpT/ow7V7ArtlC','ACTIVE','Ninh'),(3,'/static_resource/public/upload/avatars/67324df7-00ec-4355-ab9f-074c0374f2fe_wall_1920x1080_019.png','user01','2026-04-10 15:30:24.371517','2222-12-11','user01@gmail.com','2026-04-10 17:55:05.766718','$2a$10$54izXhXVRXubeNjUTQvT/uJG0jF.HRxuX20blhorpT/ow7V7ArtlC','ACTIVE','user01'),(4,'/static_resource/public/upload/avatars/82a4ac78-4c37-4394-aa30-9d1d04da1fc3_wall_unknown_110.jpg','I am Diep','2026-04-10 16:18:00.253158','2222-12-11','diepbanbua@gmail.com','2026-04-10 17:56:37.023043','$2a$10$54izXhXVRXubeNjUTQvT/uJG0jF.HRxuX20blhorpT/ow7V7ArtlC','ACTIVE','diepbanbua');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet_transaction`
--

DROP TABLE IF EXISTS `wallet_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_transaction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` bigint DEFAULT NULL,
  `commission` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `gross_amount` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `status` enum('COMPLETE','FAIL','PENDING') DEFAULT NULL,
  `type` enum('ORDER_REVENUE','REFUND','RELEASE_PENDING','WITHDRAW') DEFAULT NULL,
  `wallet_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3csowqwx8sfiqwwte6hke9uft` (`wallet_id`),
  CONSTRAINT `FK3csowqwx8sfiqwwte6hke9uft` FOREIGN KEY (`wallet_id`) REFERENCES `seller_wallet` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_transaction`
--

LOCK TABLES `wallet_transaction` WRITE;
/*!40000 ALTER TABLE `wallet_transaction` DISABLE KEYS */;
INSERT INTO `wallet_transaction` VALUES (1,243000,27000,'2026-04-10 16:24:20.556278','Nhận tiền đơn hàng #9 (Phí sàn 10%)',270000,9,'COMPLETE','ORDER_REVENUE',1),(2,27000,3000,'2026-04-10 17:57:28.082952','Nhận tiền đơn hàng #10 (Phí sàn 10%)',30000,10,'COMPLETE','ORDER_REVENUE',1),(3,243000,NULL,'2026-04-10 18:00:25.433565','Giải ngân tiền đơn hàng sau khi đã trừ phí #9 vào ví chính',NULL,9,'COMPLETE','RELEASE_PENDING',1),(4,27000,NULL,'2026-04-10 18:00:26.385991','Giải ngân tiền đơn hàng sau khi đã trừ phí #10 vào ví chính',NULL,10,'COMPLETE','RELEASE_PENDING',1),(5,-270,NULL,'2026-04-10 18:00:41.565314','Rút tiền từ ví',NULL,NULL,'COMPLETE','WITHDRAW',1);
/*!40000 ALTER TABLE `wallet_transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-10 18:16:08
