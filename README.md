# Cryptocoins

Esta aplicación esta construida con la intención de aplicar los principios SOLID de
la programación orientada a objetos y una propuesta de implementación de la arquitectura
hexagonal en aplicaciones de NodeJS usando Typescript en la que se encuentran las siguientes capas:

- ### Domain
    Capa que contiene los casos de uso de la aplicación que a su vez contienen la lógica
  de negocio y no depende de ningún componente ajeno a la tecnología nativa (NodeJS)
  
- ### Interfaces
    Capa que contiene las interfaces que utiliza la aplicación para implementar la
  inyección de dependencias en las clases que sea necesaria.
  
- ### Infrastructure
    Capa que contiene los adaptadores que implementan las interfaces necesarias para
  la comunicación del dominio con los componentes ajenos a la tecnología nativa (NodeJS)
  
- ### Models
    Capa que contiene los modelos generales de las entidades que se utilizan en la
  aplicación.
  
- ### IOC
    Capa que contiene el sistema de inversión de control donde se centraliza el manejo
  de inyección de dependencias de toda la aplicación.
  
# Requisitos

Para ejecutar la aplicación localmente se requieren las siguientes instalaciones en su
sistema:

- [NodeJS](https://nodejs.org/es/)
- [Docker](https://www.docker.com/)

## Pasos para su ejecución

1. Ejecutar Docker en su sistema y crear un contendor que corra una imagen de 
[MongoDB](https://www.mongodb.com/es) mediante el siguiente comando:
   ```
   docker run -d --name mongodb -p 27017:27017 mongo
   ```
   
2. Una vez la base de datos esté corriendo exitosamente, abrir una terminal de 
   comandos en el directorio principal del proyecto y ejecutar el siguiente comando
   para instalar las dependencias del proyecto:
   ```
   npm install
   ```
   
3. Al terminar las instalaciones, puede crear un archivo de configuración local llamado
`.env` en el directorio principal en el que deberá incluir la siguiente información 
   acorde a los datos de su entorno de ejecución:
   ```
   SERVER_PORT=8080
   SECRET_TOKEN=secretOfToken
   EXPIRATION_MINUTES=60
   CRYPTOCOIN_URL=https://api.coingecko.com/api/v3
   DB_PROTOCOL=mongodb
   DB_HOST=localhost
   DB_PORT=27017
   DB_NAME=cryptocoins
   ```
   
4. Ahora puede poner en marcha la aplicación mediante el comando:
    ```
    npm start
    ```
   Si en el archivo `.env` usa los mismos valores que en el ejemplo anterior la 
aplicación deberá estar ejecutandose en la url `http://localhost:8080`.
   Para verificarlo puede navegar a la ruta 
   [http://localhost:8080/cryptocoins/v1/api/health](http://localhost:8080/cryptocoins/v1/api/health)
   y debería obtener una respuesta `"OK"` en pantalla
   
## Probar el API

Para probar el api puede usar la aplicación [Postman](https://www.postman.com/) 
e importar el archivo `Cryptocoins.postman_collection.json` que contiene la colección
de peticiones a cada uno de los endpoints expuestos por la aplicación.
