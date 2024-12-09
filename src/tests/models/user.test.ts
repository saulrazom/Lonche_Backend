import mongoose from 'mongoose';
import User from '../../models/User'; // Ajusta el path según tu estructura

const createInvalidUser = () => new User(); // Función para crear un usuario inválido

const validateUserError = async (user: mongoose.Document) => {
    try {
        await user.validate();
    } catch (err) {
        return err as mongoose.Error.ValidationError;
    }
};

describe('User Model Validation', () => {
    it('should throw validation error if required fields are missing', async () => {
        const user = createInvalidUser();
        const error = await validateUserError(user);
        
        expect(error).toBeDefined();
        expect(error!.errors).toHaveProperty('email'); // Verifica que 'email' sea requerido
    });
});
