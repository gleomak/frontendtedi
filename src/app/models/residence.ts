export interface ReservationFromTo{
    from: string;
    to: string;
}

export interface ResidenceReview{
    residenceId:            number;
    starRating:             string;
    description:            string;
    username:               string;
}

export interface Residence {
    id:                    number;
    title:                 string;
    neighborhood:          string;
    city:                  string;
    country:               string;
    residentCapacity:      number;
    numOfBeds:             number;
    numOfBathrooms:        number;
    residenceType:         string;
    numOfBedrooms:         number;
    costPerNight:          number;
    livingRoom:            boolean;
    squareMeters:          number;
    description:           string;
    smoking:               boolean;
    pets:                  boolean;
    events:                boolean;
    internet:              boolean;
    aircondition:          boolean;
    kitchen:               boolean;
    parkingSpot:           boolean;
    tv:                    boolean;
    minDaysForReservation: number;
    address:               string;
    latitude:              string;
    longitude:             string;
    imageURL:              string[];
    reservationFromTo:     ReservationFromTo[];
    userId:                string;
    reviewss:                ResidenceReview[];
}

export interface ResidenceSearch{
    city?:                  string | null;
    country?:               string | null;
    neighborhood?:          string | null;
    from?:                  string;
    to?:                    string;
    numOfPeople?:           number;
    internet?:              boolean | null;
    aircondition?:          boolean | null;
    kitchen?:               boolean | null;
    parkingSpot?:           boolean | null;
    tv?:                    boolean | null;
    pageSize:               number;
    pageNumber:             number;
}