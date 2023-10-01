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

export interface HostReview{
    id: number;
    description: string;
    starRating: number;
    userId: string;
    reviewByUser:string;
}

export interface Host{
    rating: number;
    imageURL: string;
    username: string;
    hostReviews: HostReview[];
}

export interface Message{
    id: number;
    message: string;
    residenceTitle?: string;
    senderUsername: string;
    senderImageURL: string;
}

export interface MessageParams{
    pageNumber: number;
    pageSize: number;
    searchResidenceName?: string | null;
}