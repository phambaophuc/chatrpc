export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  userId: string;
  token: string;
}

export interface IAuthService {
  login(request: ILoginRequest): Promise<ILoginResponse>;
  register(request: IRegisterRequest): Promise<ILoginResponse>;
}
