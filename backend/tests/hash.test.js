require('dotenv').config();
const bcrypt = require('bcryptjs');

describe('Password hashing', () => {
  it('should hash the password correctly', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should fail if passwords do not match', async () => {
    const password = 'password123';
    const wrongPassword = 'wrongpassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);
    expect(isMatch).toBe(false);
  });
});
