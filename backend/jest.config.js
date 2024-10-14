module.exports = {
  // Andere Jest-Konfigurationen
  maxConcurrency: 1,  // Führt nur einen Test gleichzeitig aus
  testTimeout: 15000,
  maxWorkers: 1,
  setupFilesAfterEnv: ['./jest.setup.js'], // Führt das Setup vor allen Tests aus
  globalTeardown: './jest.teardown.js',     // Führt das Teardown nach allen Tests aus
  testEnvironment: 'node',                  // Falls notwendig, z.B. für Datenbanktests
};