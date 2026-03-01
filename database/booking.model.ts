import { Schema, model, models, Document } from 'mongoose';
import Event from './event.model'; // Used for reference validation

// Interface for the Booking document for strong typing
export interface IBooking extends Document {
  eventId: Schema.Types.ObjectId; // Reference to the Event
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  // Indexed for faster queries on a specific event's bookings
  eventId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true, 
    index: true 
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    // Simple regex for email validation
    match: [/.+@.+\..+/, 'Please provide a valid email address'],
  },
}, { 
  // Enable automatic timestamps (createdAt, updatedAt)
  timestamps: true,
  strict: 'throw',
});

// Pre-save hook to verify that the referenced eventId actually exists.
bookingSchema.pre<IBooking>('save', async function (next) {
  // Only run this check on new documents to prevent validation on every update
  if (this.isNew) {
    try {
      const eventExists = await Event.findById(this.eventId);
      if (!eventExists) {
        // If no event is found, throw an error to prevent orphaned bookings
        throw new Error('Referenced event does not exist.');
      }
    } catch (error: any) {
      // Pass any errors (e.g., from the database query) to the next middleware
      return next(error);
    }
  }
  next();
});

// Check if the model already exists to prevent recompilation issues in Next.js
const Booking = models.Booking || model<IBooking>('Booking', bookingSchema);

export default Booking;
