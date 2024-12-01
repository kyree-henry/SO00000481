export interface JwtPayload {
    sub: string;          
    email: string;       
    firstName: string;   
    lastName: string;    
    fullName: string;    
    accountType: string;  
    roles: string[];   
    phoneNumber?: string; 
    [key: string]: any; 
  }