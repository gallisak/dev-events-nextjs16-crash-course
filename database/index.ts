// This file serves as a central export point for all Mongoose models,
// simplifying imports in other parts of the application.

import Event from './event.model';
import Booking from './booking.model';

export { Event, Booking };
export type { IEvent } from './event.model';
export type { IBooking } from './booking.model';
