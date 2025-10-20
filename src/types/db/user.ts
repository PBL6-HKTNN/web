import { type Base } from "../core";

export type User = Base & {
  name: string;
  email: string;
  googleId: string;
  role: string;
  status: string;
  profilePicture?: string;
  bio?: string;
  emailVerified: boolean;
}
