import mongoose, { Document, Schema } from 'mongoose';
import LANGUAGES from '../types/languages';

export interface City extends Document {
  name: string;
  region: string;
  country: string;
  language: LANGUAGES;
}

const CitySchema = new Schema({
  name: {
    type: String,
    required: [true, 'City name is required'],
    minlength: [2, 'City name must be at least 2 characters long'],
    maxlength: [100, 'City name must not exceed 100 characters'],
    unique: [true, 'City already exists'],
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    minlength: [2, 'Region must be at least 2 characters long'],
    maxlength: [100, 'Region must not exceed 100 characters'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    minlength: [2, 'Country must be at least 2 characters long'],
    maxlength: [100, 'Country must not exceed 100 characters'],
  },
  language: {
    type: String,
    enum: {
      values: Object.values(LANGUAGES),
      message: '{VALUE} is not a valid language',
    },
    required: [true, 'Language is required'],
  },
});

const cityModel = mongoose.model<City>('City', CitySchema);
export default cityModel;
