export interface Residence {
    id:                    number;
    title:                 string;
    neighborhood:          string;
    city:                  string;
    country:               string;
    residenceCapacity:     string;
    numOfBeds:             number;
    numOfBathrooms:        number;
    residenceType:         string;
    numOfBedrooms:         number;
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
    imageURL:              string;
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