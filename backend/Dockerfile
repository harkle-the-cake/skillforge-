# Nutze ein Node-Image
FROM node:18

# Erstelle das Verzeichnis für die App
WORKDIR /usr/src/app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes
COPY . .

# Exponiere den Port, auf dem die App läuft
EXPOSE 9999

# Starte die Anwendung
CMD ["npm", "start"]
