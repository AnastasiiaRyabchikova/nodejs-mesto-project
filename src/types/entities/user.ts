export default interface IUser {
  name: string,
  about: string,
  avatar: string,
  password: string,
  email: string,
}

export interface AuthContext {
  user: {
    _id: string,
  }
}
