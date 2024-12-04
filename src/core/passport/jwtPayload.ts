import { Globals } from "../../core/globals";

export interface JwtPayload {
  [Globals.ClaimTypes.UserId]: string;
  [Globals.ClaimTypes.Email]: string;
  [Globals.ClaimTypes.GivenName]: string;
  [Globals.ClaimTypes.FamilyName]: string;
  [Globals.ClaimTypes.FullName]: string;
  [Globals.ClaimTypes.UserType]: string;
  [key: string]: any;
}