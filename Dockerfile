FROM node:19.8.1-slim

# Establece el directorio de trabajo
WORKDIR /dist

# Copia los archivos de la aplicación
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Ejecuta el compilador de TypeScript
RUN npm run build

# Expone el puerto en el que tu aplicación se ejecuta
EXPOSE 8080

# Comando para ejecutar tu aplicación
CMD ["npm", "start"]
