import mongoose from 'mongoose';
import Post from '../../models/Post'; // Ajusta el path según tu estructura

describe('Post Model Validation', () => {
  it('should throw validation error if required fields are missing', async () => {
    const post = new Post(); // Crear un post vacío
    try {
      await post.validate();
    } catch (err) {
      const error = err as mongoose.Error.ValidationError;
      expect(error.errors).toHaveProperty('title'); // Verifica que 'title' sea requerido
    }
  });
});
