import { Residence } from "./residence";
import { User } from "./user";

export interface Reservation {
    id: number;
    residenceId: number;
    residence: Residence;
    from: string;
    to: string;
    userId: string | null;
    user: User;
}