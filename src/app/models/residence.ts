export interface Residence {
    id:                    number;
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
    pageSize:               number;
    pageNumber:             number;
}