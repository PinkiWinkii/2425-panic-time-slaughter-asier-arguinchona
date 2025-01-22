const {getAllCharacters} = require('./../controllers/characterController')
const Character = require('./../models/Character')

// Mockeamos el modelo User 
jest.mock('./../models/Character')

describe('Character Controller Tests', () => {
  it('should return the characters', async () => {
    // Datos simulados que devolverá el mock de User.find
    const mockCharacters = [
      {
        name: 'Polimorfias',
      },
      {
        name: 'Calvorot',
      },
    ];

    Character.find.mockResolvedValue(mockCharacters);

    // Simulamos los objetos req y res
    const req = {}; 
    const res = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(),
    };

    await getAllCharacters(req, res);

    // Verify status 200 
    expect(res.status).toHaveBeenCalledWith(200);

    // Verify message
    expect(res.json).toHaveBeenCalledWith(mockCharacters);
  });

  it('should handle errors and return 500 status', async () => {
    // Mock find function to intentionally throw an error
    Character.find.mockRejectedValue(new Error('Database error'));

    // Simulamos los objetos req y res
    const req = {}; 
    const res = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(), 
    };

    await getAllCharacters(req, res);

    // Verify status 500 
    expect(res.status).toHaveBeenCalledWith(500);

    // Verify message
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching characters: Database error', message: 'Error fetching characters' });
  });

  
});