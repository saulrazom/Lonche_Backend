import cityModel from '../models/City';
import BaseController from '../utils/BaseController';
import { City } from '../models/City';
import { Model } from 'mongoose';

class CitiesController extends BaseController<City> {
  constructor(model: Model<City>) {
    super(model);
  }
}

export default new CitiesController(cityModel);
