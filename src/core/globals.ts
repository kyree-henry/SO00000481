export namespace Globals {

    export class Roles {
        public static readonly User = "User";
        public static readonly Admin = "Admin";
    }

    export class ClaimTypes {

        public static readonly UserId = "http://basic-store.com/claims/sub";
        public static readonly Email = "http://basic-store.com/claims/email";
        public static readonly UserType = "http://basic-store.com/claims/usertype";
        public static readonly GivenName = "http://basic-store.com/claims/givenname";
        public static readonly FamilyName = "http://basic-store.com/claims/familyname";
        public static readonly FullName = "http://basic-store.com/claims/fullname";
        public static readonly Role = "http://basic-store.com/claims/role";
    }
} 