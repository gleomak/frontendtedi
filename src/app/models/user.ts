export interface User{
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    phoneNumber: string;
    pictureURL?: string;
    token: string;
    roles?: string[];
    roleAuthorized: boolean;
    userId : string;
}

export interface Host{
    rating: number;
    imageURL: string;
    username: string;

}