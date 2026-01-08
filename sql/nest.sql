/*
 Navicat Premium Dump SQL

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 90500 (9.5.0)
 Source Host           : localhost:3306
 Source Schema         : nest

 Target Server Type    : MySQL
 Target Server Version : 90500 (9.5.0)
 File Encoding         : 65001

 Date: 08/01/2026 13:42:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for audit_log
-- ----------------------------
DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `action_type` varchar(255) NOT NULL,
  `resource_type` varchar(255) DEFAULT NULL,
  `resource_id` varchar(255) DEFAULT NULL,
  `description` text,
  `method` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` text,
  `params` text,
  `old_data` text,
  `new_data` text,
  `status` varchar(255) NOT NULL DEFAULT 'SUCCESS',
  `error_message` text,
  `request_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of audit_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sign` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sort` int NOT NULL,
  `parentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_41c446d29bbb76111ace88bcc59` (`parentId`) USING BTREE,
  CONSTRAINT `FK_41c446d29bbb76111ace88bcc59` FOREIGN KEY (`parentId`) REFERENCES `permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of permission
-- ----------------------------
BEGIN;
INSERT INTO `permission` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `sign`, `sort`, `parentId`) VALUES ('813dd0a1-4bc7-4f9e-b370-26ddd6b6e918', '2026-01-08 12:33:12', NULL, '2026-01-08 12:42:06', NULL, '查看用户', 'user:view', 5, 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `permission` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `sign`, `sort`, `parentId`) VALUES ('81dc89f6-c3aa-4e32-86bc-a7fef952feca', '2025-01-24 17:09:37', NULL, '2026-01-08 12:43:11', NULL, '用户管理', 'settingAuthManagerUser', 7, 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `permission` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `sign`, `sort`, `parentId`) VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', '2025-01-24 16:17:27', NULL, '2025-01-24 16:17:27', NULL, '设置', 'setting', 1, NULL);
INSERT INTO `permission` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `sign`, `sort`, `parentId`) VALUES ('c57d427e-15be-4a0e-9e57-4303b99dcb05', '2025-01-24 17:09:50', NULL, '2026-01-08 12:37:04', NULL, '角色管理', 'settingAuthManagerRole', 6, 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `permission` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `sign`, `sort`, `parentId`) VALUES ('fa256a8a-5477-4353-a621-66662184bfbc', '2025-01-24 17:09:46', NULL, '2026-01-08 12:44:16', NULL, '权限管理', 'settingAuthManagerPermission', 6, 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
COMMIT;

-- ----------------------------
-- Table structure for permission_closure
-- ----------------------------
DROP TABLE IF EXISTS `permission_closure`;
CREATE TABLE `permission_closure` (
  `id_ancestor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_descendant` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_ancestor`,`id_descendant`) USING BTREE,
  KEY `IDX_5a9be34c7833062e6cceb562d5` (`id_ancestor`) USING BTREE,
  KEY `IDX_13672a2e7e3e11c7edb147298a` (`id_descendant`) USING BTREE,
  CONSTRAINT `FK_13672a2e7e3e11c7edb147298a4` FOREIGN KEY (`id_descendant`) REFERENCES `permission` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_5a9be34c7833062e6cceb562d54` FOREIGN KEY (`id_ancestor`) REFERENCES `permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of permission_closure
-- ----------------------------
BEGIN;
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('813dd0a1-4bc7-4f9e-b370-26ddd6b6e918', '813dd0a1-4bc7-4f9e-b370-26ddd6b6e918');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('81dc89f6-c3aa-4e32-86bc-a7fef952feca', '813dd0a1-4bc7-4f9e-b370-26ddd6b6e918');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('81dc89f6-c3aa-4e32-86bc-a7fef952feca', '81dc89f6-c3aa-4e32-86bc-a7fef952feca');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', '813dd0a1-4bc7-4f9e-b370-26ddd6b6e918');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', '81dc89f6-c3aa-4e32-86bc-a7fef952feca');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', 'c57d427e-15be-4a0e-9e57-4303b99dcb05');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('b2f8f794-78d0-41b9-a4ce-9f7c7f808d66', 'fa256a8a-5477-4353-a621-66662184bfbc');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('c57d427e-15be-4a0e-9e57-4303b99dcb05', 'c57d427e-15be-4a0e-9e57-4303b99dcb05');
INSERT INTO `permission_closure` (`id_ancestor`, `id_descendant`) VALUES ('fa256a8a-5477-4353-a621-66662184bfbc', 'fa256a8a-5477-4353-a621-66662184bfbc');
COMMIT;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
BEGIN;
INSERT INTO `role` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `remark`, `status`) VALUES ('86bbe707-c834-446a-998f-6ce11ec08ab5', '2025-01-08 17:58:13', NULL, '2025-01-21 16:24:34', NULL, '管理员', '别乱改了', '');
INSERT INTO `role` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `name`, `remark`, `status`) VALUES ('c4672de0-87bc-4185-a270-84598850abbc', '2025-01-08 17:39:59', NULL, '2025-02-05 13:59:00', NULL, '小明的', '试试', '');
COMMIT;

-- ----------------------------
-- Table structure for role_permissions_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permissions_permission`;
CREATE TABLE `role_permissions_permission` (
  `roleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `permissionId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`roleId`,`permissionId`) USING BTREE,
  KEY `IDX_b36cb2e04bc353ca4ede00d87b` (`roleId`) USING BTREE,
  KEY `IDX_bfbc9e263d4cea6d7a8c9eb3ad` (`permissionId`) USING BTREE,
  CONSTRAINT `FK_b36cb2e04bc353ca4ede00d87b9` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bfbc9e263d4cea6d7a8c9eb3ad2` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_permissions_permission
-- ----------------------------
BEGIN;
INSERT INTO `role_permissions_permission` (`roleId`, `permissionId`) VALUES ('86bbe707-c834-446a-998f-6ce11ec08ab5', '81dc89f6-c3aa-4e32-86bc-a7fef952feca');
INSERT INTO `role_permissions_permission` (`roleId`, `permissionId`) VALUES ('86bbe707-c834-446a-998f-6ce11ec08ab5', 'b2f8f794-78d0-41b9-a4ce-9f7c7f808d66');
INSERT INTO `role_permissions_permission` (`roleId`, `permissionId`) VALUES ('86bbe707-c834-446a-998f-6ce11ec08ab5', 'c57d427e-15be-4a0e-9e57-4303b99dcb05');
INSERT INTO `role_permissions_permission` (`roleId`, `permissionId`) VALUES ('86bbe707-c834-446a-998f-6ce11ec08ab5', 'fa256a8a-5477-4353-a621-66662184bfbc');
INSERT INTO `role_permissions_permission` (`roleId`, `permissionId`) VALUES ('c4672de0-87bc-4185-a270-84598850abbc', '81dc89f6-c3aa-4e32-86bc-a7fef952feca');
INSERT INTO `role_permissions_permission` (`roleId`, `permissionId`) VALUES ('c4672de0-87bc-4185-a270-84598850abbc', 'fa256a8a-5477-4353-a621-66662184bfbc');
COMMIT;

-- ----------------------------
-- Table structure for role_users_user
-- ----------------------------
DROP TABLE IF EXISTS `role_users_user`;
CREATE TABLE `role_users_user` (
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `roleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`roleId`,`userId`) USING BTREE,
  KEY `IDX_ed6edac7184b013d4bd58d60e5` (`roleId`) USING BTREE,
  KEY `IDX_a88fcb405b56bf2e2646e9d479` (`userId`) USING BTREE,
  CONSTRAINT `FK_a88fcb405b56bf2e2646e9d4797` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_ed6edac7184b013d4bd58d60e54` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_users_user
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `username`, `password`, `tel`, `email`, `nickname`, `avatar`, `status`) VALUES ('550c0485-5e54-4fbf-8ae4-5ac60ef383df', '2025-01-07 17:28:09', NULL, '2025-02-05 15:20:23', NULL, '17761744292', 'U2FsdGVkX18CNyzk9H7wvLnoFT0TLGLOQoyyySthwgo=', NULL, '448987786@qq.com', '小明', NULL, '1');
INSERT INTO `user` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `username`, `password`, `tel`, `email`, `nickname`, `avatar`, `status`) VALUES ('790b896c-ec2e-11f0-9abc-f0a46407f4b7', '2026-01-08 09:07:59', NULL, '2026-01-08 09:09:59', NULL, 'admin', '$2b$10$wn3tY3SvDr8ZR6/E2cMy3.7fWl34OK6TD7wdnHXFF8e4hMTEqwTVa', '13800138000', 'admin@example.com', '管理员', NULL, '1');
INSERT INTO `user` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `username`, `password`, `tel`, `email`, `nickname`, `avatar`, `status`) VALUES ('ec1581f9-6fc8-4aee-ab41-b4f4318d4cd3', '2025-01-21 14:20:05', NULL, '2025-01-23 16:04:30', NULL, 'wwz', 'U2FsdGVkX1/Ml9c438kJQDaIjdngJJa0lnmZRUv4yAE=', NULL, NULL, '小真', NULL, '1');
COMMIT;

-- ----------------------------
-- Table structure for user_roles_role
-- ----------------------------
DROP TABLE IF EXISTS `user_roles_role`;
CREATE TABLE `user_roles_role` (
  `userId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `roleId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`userId`,`roleId`) USING BTREE,
  KEY `IDX_5f9286e6c25594c6b88c108db7` (`userId`) USING BTREE,
  KEY `IDX_4be2f7adf862634f5f803d246b` (`roleId`) USING BTREE,
  CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`),
  CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user_roles_role
-- ----------------------------
BEGIN;
INSERT INTO `user_roles_role` (`userId`, `roleId`) VALUES ('550c0485-5e54-4fbf-8ae4-5ac60ef383df', '86bbe707-c834-446a-998f-6ce11ec08ab5');
INSERT INTO `user_roles_role` (`userId`, `roleId`) VALUES ('790b896c-ec2e-11f0-9abc-f0a46407f4b7', '86bbe707-c834-446a-998f-6ce11ec08ab5');
INSERT INTO `user_roles_role` (`userId`, `roleId`) VALUES ('ec1581f9-6fc8-4aee-ab41-b4f4318d4cd3', 'c4672de0-87bc-4185-a270-84598850abbc');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
