export interface User{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    phoneNumber: string;
    pictureURL?: string;
    token: string;
    roles?: string[];
}