// src/modules/user/dto/res/user-res.dto.ts
import { Role } from "../../entities/role.entity";

/**
 * 用户响应数据传输对象 (DTO)
 * 用于定义返回给客户端的用户数据结构
 */
export class RoleResDto extends Role {

  /**
   * 构造函数
   * @param user - 用户实体对象
   */
  constructor(user: any) {
    super();
    Object.assign(this as any, user);
  }
}
