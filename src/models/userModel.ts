import mongoose, { Schema, Document } from 'mongoose';

// Define an interface representing a User document in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Define the User schema
const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model using the schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;
