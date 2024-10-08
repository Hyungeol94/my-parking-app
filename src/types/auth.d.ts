interface Person {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  type: string;
  extra: ExtraType;
}

type ExtraType = {
  lat?: string;
  lng?: string;
  carNumber?: string;
  profileImage?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AuthSlice {
  userToken: TokenInfoType["token"];
  userBasicInfo: UserBasicInfoType;
  isLoggedIn: boolean;
  signUp: (UserInput: UserInputType) => Promise<AuthAlertType>;
  verifyEmail: (email: string) => Promise<AuthAlertType>;
  login: (
    email: string,
    password: string
  ) => Promise<UserBasicInfoType & TokenInfoType & LoginDataError>;
  updateUserBasicInfo: (
    userToken: TokenInfoType["token"],
    userBasicInfo: UserBasicInfoType
  ) => void;
  logout: () => void;
}

interface AuthResponseType {
  config: object;
  data: {
    ok: number;
    message?: string;
  };
}
interface UserBasicInfoType {
  _id: number;
  email: string;
  name: string;
  type: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface TokenInfoType {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

interface LoginDataError {
  ok: number;
  message: string;
}

interface LoginResponseType {
  config: object;
  data: {
    ok: number;
    item: UserBasicInfoType & TokenInfoType;
  };
}

interface AuthAlertType {
  ok: boolean;
  message: string;
}
