import api from './api';

export interface IUser {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  status: string;
  role: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  name: string;
  contactNumber: string;
  email: string;
  password: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const userService = {
  login: (data: ILoginRequest) => {
    return api.post<string>('/user/login', data);
  },

  signup: (data: ISignupRequest) => {
    return api.post<string>('/user/signup', data);
  },

  getAllUsers: () => {
    return api.get<IUser[]>('/user/get');
  },

  updateUserStatus: (userId: number, status: string) => {
    return api.post<string>('/user/update', { id: userId, status });
  },

  checkToken: () => {
    return api.get<string>('/user/checkToken');
  },

  changePassword: (data: IChangePasswordRequest) => {
    return api.post<string>('/user/changePassword', data);
  },

  forgotPassword: (email: string) => {
    return api.post<string>('/user/forgotPassword', { email });
  }
};

export default userService;
