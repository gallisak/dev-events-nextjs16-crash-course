import { Schema, model, models, Document } from 'mongoose';

// Interface for the Event document for strong typing
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location:string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: [true, 'Title is required'] },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: [true, 'Description is required'] },
  overview: { type: String, required: [true, 'Overview is required'] },
  image: { type: String, required: [true, 'Image URL is required'] },
  venue: { type: String, required: [true, 'Venue is required'] },
  location: { type: String, required: [true, 'Location is required'] },
  date: { type: String, required: [true, 'Date is required'] },
  time: { type: String, required: [true, 'Time is required'] },
  mode: { type: String, enum: ['online', 'offline', 'hybrid'], required: [true, 'Mode is required'] },
  audience: { type: String, required: [true, 'Audience is required'] },
  agenda: { type: [String], required: true },
  organizer: { type: String, required: [true, 'Organizer is required'] },
  tags: { type: [String], required: true },
}, { 
  // Enable automatic timestamps (createdAt, updatedAt)
  timestamps: true,
  // Ensure that non-schema fields are not saved
  strict: 'throw',
});

// Pre-save hook for business logic (slug generation, date/time normalization)
eventSchema.pre<IEvent>('save', function (next) {
  // Generate a URL-friendly slug from the title if it's new or has changed.
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars.
      .replace(/[\s_-]+/g, '-') // Collapse whitespace and hyphens.
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens.
  }

  // Validate and normalize the 'date' to ISO format (YYYY-MM-DD).
  if (this.isModified('date') || this.isNew) {
    const d = new Date(this.date);
    // Check if the date is valid before converting
    if (isNaN(d.getTime())) {
      return next(new Error('Invalid date format. Please use a valid date string.'));
    }
    this.date = d.toISOString().split('T')[0]; // Store as YYYY-MM-DD
  }

  // Validate that 'time' is stored in a consistent format (HH:MM 24-hour).
  if (this.isModified('time') || this.isNew) {
    const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
    if (!timeRegex.test(this.time)) {
      return next(new Error('Invalid time format. Please use HH:MM (24-hour) format.'));
    }
  }

  next();
});

// Check if the model already exists to prevent recompilation issues in Next.js
const Event = models.Event || model<IEvent>('Event', eventSchema);

export default Event;
