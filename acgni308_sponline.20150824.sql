-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- 主機: 127.0.0.1
-- 產生時間： 2015 �?08 ??23 ??18:09
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
('0771', 1, 'POON', 'Yat Lam', 'POON YAT LAM', 'passport04.jpg', 'Shelley', 'M', '1986-07-10', 'P.O. Box 210, 3541 Phasellus St.\nDolor Sit Amet Inc.\nQC', '25143600', '63524100', 'shelley@com'),
('0772', 9, 'Chow', 'Shiu Hui', 'Chow Shiu Hui', 'alexandre-prates-emprego-renda.jpg', 'Rocky', 'M', '1994-03-02', '4204 Erat. Avenue\nVel Convallis Limited\nMunster', '25143689', '85296341', 'rocky@com');

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
 ADD KEY `permissionGroupName` (`permissionGroupName`);

--
-- 資料表索引 `webuser`
--
ALTER TABLE `webuser`
 ADD PRIMARY KEY (`userID`), ADD UNIQUE KEY `loginID` (`loginID`), ADD KEY `permissionID` (`permissionID`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `permission`
--
ALTER TABLE `permission`
MODIFY `permissionID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- 使用資料表 AUTO_INCREMENT `webuser`
--
ALTER TABLE `webuser`
MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
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
ADD CONSTRAINT `permissiongroupright_ibfk_1` FOREIGN KEY (`permissionGroupName`) REFERENCES `permissiongroup` (`permissionGroupName`);

--
-- 資料表的 Constraints `webuser`
--
ALTER TABLE `webuser`
ADD CONSTRAINT `webuser_ibfk_1` FOREIGN KEY (`permissionID`) REFERENCES `permission` (`permissionID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
