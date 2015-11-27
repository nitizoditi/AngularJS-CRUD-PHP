-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- 主機: 127.0.0.1
-- 產生時間： 2015 �?10 ??03 ??05:48
-- 伺服器版本: 5.6.21
-- PHP 版本： 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫： `acgni308_sponline`
--

-- --------------------------------------------------------

--
-- 資料表結構 `area`
--

CREATE TABLE IF NOT EXISTS `area` (
  `areaCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `areaDescription` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `catalog`
--

CREATE TABLE IF NOT EXISTS `catalog` (
`catalogID` int(10) NOT NULL,
  `parentCatalogID` int(10) NOT NULL,
  `catalogName` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `catalogDescription` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `district`
--

CREATE TABLE IF NOT EXISTS `district` (
  `districtCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `districtName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `areaCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `member`
--

CREATE TABLE IF NOT EXISTS `member` (
  `memberID` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `userID` int(10) DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `fullName` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `imagePath` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nickName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `dateOfBirth` date NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contactNo1` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contactNo2` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 資料表的匯出資料 `member`
--

INSERT INTO `member` (`memberID`, `userID`, `lastName`, `firstName`, `fullName`, `imagePath`, `nickName`, `gender`, `dateOfBirth`, `address`, `contactNo1`, `contactNo2`, `email`) VALUES
('0771', 1, 'POON', 'Yat Lam', 'POON YAT LAM', 'passport04.jpg', 'Frankie', 'M', '1986-07-10', 'P.O. Box 210, 3541 Phasellus St.\nDolor Sit Amet Inc.\nQC', '25143600', '63524100', 'shelley@com'),
('0772', 9, 'Chow', 'Shiu Hui', 'Chow Shiu Hui', 'alexandre-prates-emprego-renda.jpg', 'Sindy', 'F', '1994-03-02', '4204 Erat. Avenue\nVel Convallis Limited\nMunster', '25143689', '85296341', 'rocky@com');

-- --------------------------------------------------------

--
-- 資料表結構 `permission`
--

CREATE TABLE IF NOT EXISTS `permission` (
`permissionID` int(10) NOT NULL,
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `level` int(10) DEFAULT NULL,
  `globalCreateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalReadRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalUpdateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalDeleteRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 資料表的匯出資料 `permission`
--

INSERT INTO `permission` (`permissionID`, `permissionGroupName`, `description`, `level`, `globalCreateRight`, `globalReadRight`, `globalUpdateRight`, `globalDeleteRight`) VALUES
(3, 'admin', 'demo right', NULL, 'A', 'A', 'A', 'A'),
(4, 'user', 'general user', NULL, 'D', 'D', 'D', 'D');

-- --------------------------------------------------------

--
-- 資料表結構 `permissiongroup`
--

CREATE TABLE IF NOT EXISTS `permissiongroup` (
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `otherDesc` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 資料表的匯出資料 `permissiongroup`
--

INSERT INTO `permissiongroup` (`permissionGroupName`, `description`, `otherDesc`) VALUES
('admin', 'demo right', NULL),
('approver', NULL, NULL),
('manager', NULL, NULL),
('operator', 'Data input operator', NULL),
('user', 'Customer / Client', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `permissiongroupright`
--

CREATE TABLE IF NOT EXISTS `permissiongroupright` (
  `permissionID` int(10) DEFAULT NULL,
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `functionName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `controllerName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `readRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `updateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `deleteRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE IF NOT EXISTS `product` (
`productID` int(10) NOT NULL,
  `productName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `productDescription` mediumtext COLLATE utf8_unicode_ci,
  `sellingPoint` text COLLATE utf8_unicode_ci,
  `termOfUse` text COLLATE utf8_unicode_ci,
  `takenVenue` text COLLATE utf8_unicode_ci,
  `price` double DEFAULT NULL,
  `quantity` int(8) DEFAULT NULL,
  `publishStartDate` date DEFAULT NULL,
  `publishEndDate` date DEFAULT NULL,
  `bannerURL` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ICONURL` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deliveryMethod` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `getPointPre` int(10) DEFAULT NULL,
  `catalogID` int(10) DEFAULT NULL,
  `vendorID` int(10) DEFAULT NULL,
  `discountID` int(10) DEFAULT NULL,
  `postDate` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 資料表的匯出資料 `product`
--

INSERT INTO `product` (`productID`, `productName`, `productDescription`, `sellingPoint`, `termOfUse`, `takenVenue`, `price`, `quantity`, `publishStartDate`, `publishEndDate`, `bannerURL`, `ICONURL`, `deliveryMethod`, `getPointPre`, `catalogID`, `vendorID`, `discountID`, `postDate`, `status`, `createDate`) VALUES
(1, 'Otamatone', NULL, NULL, NULL, NULL, 105, 10, '2015-01-01', '2016-07-08', '07131507_4e1d361099455.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-08-27 14:37:03'),
(2, 'Rudy Project Rydon Photochromic - Fluoro Yellow/ImpactX Clear', NULL, NULL, NULL, NULL, 964, 10, '2015-06-13', '2015-10-31', 'Rydon-Fluoro-Yellow---ImpactX-Photo-Multi-Laser-Clear-large.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-08-27 14:37:03'),
(3, '【HKK Outdoor】窗口式防水袋', '<div>\n<div><strong>購買前，請提出交收日期，時間。所有交收以WhatsApp作實 ! 請謹記，所有交收以WhatsApp作實 !&nbsp;</strong></div>\n\n<div><strong>交收方法 :</strong></div>\n\n<div><strong>1) 面交</strong></div>\n\n<div><strong>交收地點 : 九龍灣港鐵站A出口(可不用出閘)</strong></div>\n\n<div><strong>2) 速遞&nbsp;&nbsp;</strong></div>\n\n<div><strong>加$20元</strong></div>\n\n<div><strong>3) 駕駛人士</strong></div>\n\n<div><strong>可到牛頭角定安街取貨。</strong></div>\n\n<div><strong>本公司尚有其他露營及遠足物品出售，如睡袋、帳篷、背囊、水具、炊具、地墊、行山杖和摺櫈。有需要可查看「賣方的所有拍賣品」</strong></div>\n\n<div><strong>現凡購物滿$400，即自動成為本公司之VIP，於下次光顧時可享有折扣優惠。</strong></div>\n</div>\n\n<div>&nbsp;</div>\n\n<div>&nbsp;</div>\n', NULL, NULL, NULL, 87, 30, '2015-03-01', '2015-03-31', '1139584872-ac-8463xf10x0600x0563-m', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(4, '2015新款塗鴉迷彩中學生書包韓版雙肩包男士背包旅行包女背包男包\n', NULL, NULL, NULL, NULL, 468, NULL, NULL, NULL, 'TB1hs7xIXXXXXbTXpXXXXXXXXXX_!!0-item_pic.jpg_600x600.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(5, 'Anime One Piece Monkey D Luffy Casual Unisex Clothing Tee White T-shirt S to XXL', NULL, NULL, NULL, NULL, 78, NULL, '2015-05-01', '2015-05-31', '$_57.JPG', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(6, 'New One Piece Trafalgar Law Tattoo T Shirt Short Sleeves Anime Cosplay Men', NULL, NULL, NULL, NULL, 78, NULL, '2015-06-01', '2015-06-30', '$_57.JPG', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(7, 'Anime One Piece Monkey D Luffy Straw Hat Casual Costume Clothing Unisex T-shirt', NULL, NULL, NULL, NULL, 88, 4, '2015-09-23', '2015-09-23', '360622A56FE-3537104_zps4b65c30c.jpg', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(9, 'Cute 9.8" League of Legends LOL Limited Poro Plush Stuffed Toy Figure Doll', NULL, NULL, NULL, NULL, 120, NULL, '2015-09-01', '2015-09-30', '$_57.JPG', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(10, '《多芬》Dove沐浴乳-舒活水嫩1000ml', NULL, NULL, NULL, NULL, 65, NULL, NULL, NULL, '380816.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(11, 'Instant Bronze Self Tanning Lotion', NULL, NULL, NULL, NULL, 133, NULL, NULL, NULL, '2224386.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(12, 'Garmin Forerunner 920XT HRM-Run Triathlon GPS Smart notification NEGOZIO A ROMA', NULL, NULL, NULL, NULL, 2360, NULL, '2015-09-23', '2015-09-23', 'GA1000-9B_xlarge.png', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48');

-- --------------------------------------------------------

--
-- 資料表結構 `purchase`
--

CREATE TABLE IF NOT EXISTS `purchase` (
`purchaseID` int(10) NOT NULL,
  `productID` int(10) NOT NULL,
  `purchaseQuantity` int(10) DEFAULT NULL,
  `totalAmount` int(10) DEFAULT NULL,
  `isDelivery` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `purchaseDate` date DEFAULT NULL,
  `userID` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `webuser`
--

CREATE TABLE IF NOT EXISTS `webuser` (
`userID` int(10) NOT NULL,
  `loginID` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'active',
  `isLoginOn` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isDisabled` varchar(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `activateDate` date NOT NULL,
  `permissionID` int(10) DEFAULT NULL,
  `createDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `systemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 資料表的匯出資料 `webuser`
--

INSERT INTO `webuser` (`userID`, `loginID`, `password`, `status`, `isLoginOn`, `isDisabled`, `activateDate`, `permissionID`, `createDate`, `createUser`, `lastUpdateDate`, `lastUpdateUser`, `systemUpdateUser`, `systemUpdateDate`, `systemUpdateProgram`) VALUES
(1, 'demo', '60fbb7713999ac287be814420c77f68214977384', 'active', NULL, 'N', '2015-07-08', 3, '2015-07-07 16:00:00', NULL, '2015-07-07 16:00:00', NULL, NULL, '2015-07-07 16:00:00', ''),
(9, '0772', 'ef56111a03218630989f40d20faeeb4a0921c205', 'unactivated', NULL, 'N', '0000-00-00', 4, '2015-07-14 16:00:38', NULL, '2015-07-14 16:00:38', NULL, NULL, '0000-00-00 00:00:00', '');

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `area`
--
ALTER TABLE `area`
 ADD PRIMARY KEY (`areaCode`), ADD UNIQUE KEY `areaDescription` (`areaDescription`);

--
-- 資料表索引 `catalog`
--
ALTER TABLE `catalog`
 ADD PRIMARY KEY (`catalogID`), ADD KEY `FKCatalog462296` (`parentCatalogID`);

--
-- 資料表索引 `district`
--
ALTER TABLE `district`
 ADD PRIMARY KEY (`districtCode`), ADD UNIQUE KEY `districtName` (`districtName`);

--
-- 資料表索引 `member`
--
ALTER TABLE `member`
 ADD PRIMARY KEY (`memberID`), ADD KEY `userID` (`userID`);

--
-- 資料表索引 `permission`
--
ALTER TABLE `permission`
 ADD PRIMARY KEY (`permissionID`), ADD KEY `permissionGroupName` (`permissionGroupName`);

--
-- 資料表索引 `permissiongroup`
--
ALTER TABLE `permissiongroup`
 ADD PRIMARY KEY (`permissionGroupName`);

--
-- 資料表索引 `permissiongroupright`
--
ALTER TABLE `permissiongroupright`
 ADD KEY `permissionGroupName` (`permissionGroupName`), ADD KEY `permissionID` (`permissionID`);

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
 ADD PRIMARY KEY (`productID`), ADD KEY `catalogID` (`catalogID`);

--
-- 資料表索引 `purchase`
--
ALTER TABLE `purchase`
 ADD PRIMARY KEY (`purchaseID`), ADD KEY `userID` (`userID`), ADD KEY `productID` (`productID`);

--
-- 資料表索引 `webuser`
--
ALTER TABLE `webuser`
 ADD PRIMARY KEY (`userID`), ADD UNIQUE KEY `loginID` (`loginID`), ADD KEY `permissionID` (`permissionID`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `catalog`
--
ALTER TABLE `catalog`
MODIFY `catalogID` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `permission`
--
ALTER TABLE `permission`
MODIFY `permissionID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- 使用資料表 AUTO_INCREMENT `product`
--
ALTER TABLE `product`
MODIFY `productID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- 使用資料表 AUTO_INCREMENT `purchase`
--
ALTER TABLE `purchase`
MODIFY `purchaseID` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `webuser`
--
ALTER TABLE `webuser`
MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `member`
--
ALTER TABLE `member`
ADD CONSTRAINT `member_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `webuser` (`userID`);

--
-- 資料表的 Constraints `permission`
--
ALTER TABLE `permission`
ADD CONSTRAINT `permission_ibfk_1` FOREIGN KEY (`permissionGroupName`) REFERENCES `permissiongroup` (`permissionGroupName`);

--
-- 資料表的 Constraints `permissiongroupright`
--
ALTER TABLE `permissiongroupright`
ADD CONSTRAINT `permissiongroupright_ibfk_1` FOREIGN KEY (`permissionGroupName`) REFERENCES `permissiongroup` (`permissionGroupName`),
ADD CONSTRAINT `permissiongroupright_ibfk_2` FOREIGN KEY (`permissionID`) REFERENCES `permission` (`permissionID`);

--
-- 資料表的 Constraints `product`
--
ALTER TABLE `product`
ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`catalogID`) REFERENCES `catalog` (`catalogID`);

--
-- 資料表的 Constraints `purchase`
--
ALTER TABLE `purchase`
ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`ProductID`),
ADD CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `webuser` (`userID`);

--
-- 資料表的 Constraints `webuser`
--
ALTER TABLE `webuser`
ADD CONSTRAINT `webuser_ibfk_1` FOREIGN KEY (`permissionID`) REFERENCES `permission` (`permissionID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
