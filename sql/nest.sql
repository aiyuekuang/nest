/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80037
 Source Host           : localhost:3306
 Source Schema         : nest

 Target Server Type    : MySQL
 Target Server Version : 80037
 File Encoding         : 65001

 Date: 27/04/2025 08:35:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sign` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sort` int NOT NULL,
  `parentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_41c446d29bbb76111ace88bcc59`(`parentId` ASC) USING BTREE,
  CONSTRAINT `FK_41c446d29bbb76111ace88bcc59` FOREIGN KEY (`parentId`) REFERENCES `permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('81dc89f6-c3aa-4e32-86bc-a7fef952feca', '2025-01-24 17:09:37', NULL, '2025-01-24 17:09:37', NULL, '用户管理', 'settingAuthManagerUser', 1, 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `permission` VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', '2025-01-24 16:17:27', NULL, '2025-01-24 16:17:27', NULL, '设置', 'setting', 1, NULL);
INSERT INTO `permission` VALUES ('c57d427e-15be-4a0e-9e57-4303b99dcb05', '2025-01-24 17:09:50', NULL, '2025-01-24 17:26:10', NULL, '角色管理', 'settingAuthManagerRole', 1, 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `permission` VALUES ('fa256a8a-5477-4353-a621-66662184bfbc', '2025-01-24 17:09:46', NULL, '2025-01-24 17:46:11', NULL, '权限管理', 'settingAuthManagerPermission', 3, 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');

-- ----------------------------
-- Table structure for permission_closure
-- ----------------------------
DROP TABLE IF EXISTS `permission_closure`;
CREATE TABLE `permission_closure`  (
  `id_ancestor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_descendant` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_ancestor`, `id_descendant`) USING BTREE,
  INDEX `IDX_5a9be34c7833062e6cceb562d5`(`id_ancestor` ASC) USING BTREE,
  INDEX `IDX_13672a2e7e3e11c7edb147298a`(`id_descendant` ASC) USING BTREE,
  CONSTRAINT `FK_13672a2e7e3e11c7edb147298a4` FOREIGN KEY (`id_descendant`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_5a9be34c7833062e6cceb562d54` FOREIGN KEY (`id_ancestor`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission_closure
-- ----------------------------
INSERT INTO `permission_closure` VALUES ('81dc89f6-c3aa-4e32-86bc-a7fef952feca', '81dc89f6-c3aa-4e32-86bc-a7fef952feca');
INSERT INTO `permission_closure` VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', '81dc89f6-c3aa-4e32-86bc-a7fef952feca');
INSERT INTO `permission_closure` VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `permission_closure` VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', 'c57d427e-15be-4a0e-9e57-4303b99dcb05');
INSERT INTO `permission_closure` VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', 'fa256a8a-5477-4353-a621-66662184bfbc');
INSERT INTO `permission_closure` VALUES ('c57d427e-15be-4a0e-9e57-4303b99dcb05', 'c57d427e-15be-4a0e-9e57-4303b99dcb05');
INSERT INTO `permission_closure` VALUES ('fa256a8a-5477-4353-a621-66662184bfbc', 'fa256a8a-5477-4353-a621-66662184bfbc');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('86bbe707-c834-446a-998f-6ce11ec08ab5', '2025-01-08 17:58:13', NULL, '2025-01-21 16:24:34', NULL, '管理员', '别乱改了', '');
INSERT INTO `role` VALUES ('c4672de0-87bc-4185-a270-84598850abbc', '2025-01-08 17:39:59', NULL, '2025-02-05 13:59:00', NULL, '小明的', '试试', '');

-- ----------------------------
-- Table structure for role_permissions_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permissions_permission`;
CREATE TABLE `role_permissions_permission`  (
  `roleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `permissionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`roleId`, `permissionId`) USING BTREE,
  INDEX `IDX_b36cb2e04bc353ca4ede00d87b`(`roleId` ASC) USING BTREE,
  INDEX `IDX_bfbc9e263d4cea6d7a8c9eb3ad`(`permissionId` ASC) USING BTREE,
  CONSTRAINT `FK_b36cb2e04bc353ca4ede00d87b9` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bfbc9e263d4cea6d7a8c9eb3ad2` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permissions_permission
-- ----------------------------
INSERT INTO `role_permissions_permission` VALUES ('86bbe707-c834-446a-998f-6ce11ec08ab5', 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `role_permissions_permission` VALUES ('c4672de0-87bc-4185-a270-84598850abbc', '81dc89f6-c3aa-4e32-86bc-a7fef952feca');
INSERT INTO `role_permissions_permission` VALUES ('c4672de0-87bc-4185-a270-84598850abbc', 'fa256a8a-5477-4353-a621-66662184bfbc');

-- ----------------------------
-- Table structure for role_users_user
-- ----------------------------
DROP TABLE IF EXISTS `role_users_user`;
CREATE TABLE `role_users_user`  (
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `roleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`roleId`, `userId`) USING BTREE,
  INDEX `IDX_ed6edac7184b013d4bd58d60e5`(`roleId` ASC) USING BTREE,
  INDEX `IDX_a88fcb405b56bf2e2646e9d479`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_a88fcb405b56bf2e2646e9d4797` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_ed6edac7184b013d4bd58d60e54` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_users_user
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('550c0485-5e54-4fbf-8ae4-5ac60ef383df', '2025-01-07 17:28:09', NULL, '2025-02-05 15:20:23', NULL, '17761744292', 'U2FsdGVkX18CNyzk9H7wvLnoFT0TLGLOQoyyySthwgo=', NULL, '448987786@qq.com', '小明', NULL, '1');
INSERT INTO `user` VALUES ('ec1581f9-6fc8-4aee-ab41-b4f4318d4cd3', '2025-01-21 14:20:05', NULL, '2025-01-23 16:04:30', NULL, 'wwz', 'U2FsdGVkX1/Ml9c438kJQDaIjdngJJa0lnmZRUv4yAE=', NULL, NULL, '小真', NULL, '1');

-- ----------------------------
-- Table structure for user_roles_role
-- ----------------------------
DROP TABLE IF EXISTS `user_roles_role`;
CREATE TABLE `user_roles_role`  (
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `roleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`userId`, `roleId`) USING BTREE,
  INDEX `IDX_5f9286e6c25594c6b88c108db7`(`userId` ASC) USING BTREE,
  INDEX `IDX_4be2f7adf862634f5f803d246b`(`roleId` ASC) USING BTREE,
  CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles_role
-- ----------------------------
INSERT INTO `user_roles_role` VALUES ('550c0485-5e54-4fbf-8ae4-5ac60ef383df', '86bbe707-c834-446a-998f-6ce11ec08ab5');
INSERT INTO `user_roles_role` VALUES ('ec1581f9-6fc8-4aee-ab41-b4f4318d4cd3', 'c4672de0-87bc-4185-a270-84598850abbc');

SET FOREIGN_KEY_CHECKS = 1;
