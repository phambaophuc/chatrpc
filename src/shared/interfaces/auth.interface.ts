export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  email?: string;
  password: string;
}

export interface ILoginResponse {
  userId: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string | null;
    avatar: string | null;
  };
}

export interface IAuthService {
  login(request: ILoginRequest): Promise<ILoginResponse>;
  register(request: IRegisterRequest): Promise<ILoginResponse>;
  updateUserStatus(userId: string, isOnline: boolean): Promise<void>;
}
