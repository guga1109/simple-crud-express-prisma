import {Contains, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength} from "class-validator";

export class User {
    @IsNotEmpty()
    name: string;
    
    @Matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?%#&^]{8,}$")
    password: string;
    
    @IsEmail()
    email: string;
    
    constructor(email: string, password: string, name: string) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
}