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

# Exponiere den Port für den Development Server
EXPOSE 3000

# Starte den React Development Server
CMD ["npm", "start"]
