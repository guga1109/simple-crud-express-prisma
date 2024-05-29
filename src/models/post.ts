import { IsBoolean, Length, Min } from "class-validator";

export class Post {
    @Length(5, 20, {
        message: 'Post title must be greater than 5 characters long'
    })  
    title: string;
    
    @Length(5, 500, {
        message: 'Post content must be greater than 5 characters long'
    })
    content: string;
    
    @Min(1, {
        message: 'Author ID cannot be null'
    })
    authorId: number;
    
    @IsBoolean({
        message: 'Active must be either true or false'
    })
    active: boolean;
    
    constructor(title:string, content: string, active: boolean, authorId: number) {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.active = active;
    }
}