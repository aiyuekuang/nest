/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : 192.168.31.78:3306
 Source Schema         : nest

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 19/02/2025 21:24:39
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
  `parentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sort` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_41c446d29bbb76111ace88bcc59`(`parentId` ASC) USING BTREE,
  CONSTRAINT `FK_41c446d29bbb76111ace88bcc59` FOREIGN KEY (`parentId`) REFERENCES `permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('14b98651-87c7-46e4-882b-854f973516f7', '2025-02-19 13:11:47', NULL, '2025-02-19 13:11:47', NULL, '用户管理', 'settingAuthManagerUser', 'ff167114-a97b-4b15-92aa-b348d8f10a7d', 1);
INSERT INTO `permission` VALUES ('90e1bb81-95fe-4e77-ae60-87ab73ea455d', '2025-02-19 13:11:53', NULL, '2025-02-19 13:11:53', NULL, '角色管理', 'settingAuthManagerRole', 'ff167114-a97b-4b15-92aa-b348d8f10a7d', 2);
INSERT INTO `permission` VALUES ('fa2ed1ac-89c2-4e11-8de2-7cb5f53dc03e', '2025-02-19 13:11:59', NULL, '2025-02-19 13:11:59', NULL, '权限管理', 'settingAuthManagerPermission', 'ff167114-a97b-4b15-92aa-b348d8f10a7d', 3);
INSERT INTO `permission` VALUES ('ff167114-a97b-4b15-92aa-b348d8f10a7d', '2025-02-19 13:11:40', NULL, '2025-02-19 13:11:40', NULL, '设置', 'setting', NULL, 1);

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
INSERT INTO `permission_closure` VALUES ('14b98651-87c7-46e4-882b-854f973516f7', '14b98651-87c7-46e4-882b-854f973516f7');
INSERT INTO `permission_closure` VALUES ('90e1bb81-95fe-4e77-ae60-87ab73ea455d', '90e1bb81-95fe-4e77-ae60-87ab73ea455d');
INSERT INTO `permission_closure` VALUES ('fa2ed1ac-89c2-4e11-8de2-7cb5f53dc03e', 'fa2ed1ac-89c2-4e11-8de2-7cb5f53dc03e');
INSERT INTO `permission_closure` VALUES ('ff167114-a97b-4b15-92aa-b348d8f10a7d', '14b98651-87c7-46e4-882b-854f973516f7');
INSERT INTO `permission_closure` VALUES ('ff167114-a97b-4b15-92aa-b348d8f10a7d', '90e1bb81-95fe-4e77-ae60-87ab73ea455d');
INSERT INTO `permission_closure` VALUES ('ff167114-a97b-4b15-92aa-b348d8f10a7d', 'fa2ed1ac-89c2-4e11-8de2-7cb5f53dc03e');
INSERT INTO `permission_closure` VALUES ('ff167114-a97b-4b15-92aa-b348d8f10a7d', 'ff167114-a97b-4b15-92aa-b348d8f10a7d');

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
INSERT INTO `role` VALUES ('c01b6584-b999-487c-ad57-54cd2219b0f5', '2025-02-19 13:16:56', NULL, '2025-02-19 13:16:56', NULL, '管理员', '管理员', '1');

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
INSERT INTO `role_permissions_permission` VALUES ('c01b6584-b999-487c-ad57-54cd2219b0f5', 'ff167114-a97b-4b15-92aa-b348d8f10a7d');

-- ----------------------------
-- Table structure for role_users_user
-- ----------------------------
DROP TABLE IF EXISTS `role_users_user`;
CREATE TABLE `role_users_user`  (
  `roleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
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
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('121212', '2025-02-16 16:39:40', NULL, '2025-02-19 13:17:12', NULL, '小明', '1', NULL, 'admin', 'U2FsdGVkX1/gvVCSzc5zo8MAfMpouJ4e//r+jJkjGhN2ZufuSsssDy1JowwdFIDviUYLogbs9F2t3xn+HdkfTg==', NULL, NULL);

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
INSERT INTO `user_roles_role` VALUES ('121212', 'c01b6584-b999-487c-ad57-54cd2219b0f5');

SET FOREIGN_KEY_CHECKS = 1;
