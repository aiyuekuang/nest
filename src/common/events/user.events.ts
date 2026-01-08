/**
 * 用户相关事件
 */

/**
 * 用户创建事件
 */
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly email: string,
  ) {}
}

/**
 * 用户更新事件
 */
export class UserUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly oldData: any,
    public readonly newData: any,
  ) {}
}

/**
 * 用户删除事件
 */
export class UserDeletedEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
  ) {}
}

/**
 * 用户登录事件
 */
export class UserLoginEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly ip: string,
  ) {}
}

/**
 * 用户登出事件
 */
export class UserLogoutEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
  ) {}
}
