//https://hub.docker.com/_/postgres
//https://www.prisma.io/
//https://typeorm.io/


0. gitignore:

    ````
    .env

    postgres/

    ````

1. env : 
   
   ````
    PORT=3000

    MAILER_SERVICE=gmail
    MAILER_EMAIL=fernando@google.com
    MAILER_SECRET_KEY=123123123


    PROD=false


    MONGO_URL=mongodb://fernando:123456@localhost:27017
    MONGO_DB_NAME=NOC
    MONGO_USER=fernando
    MONGO_PASS=123456


    POSTGRES_URL=
    POSTGRES_USER=postgres
    POSTGRES_DB=NOC
    POSTGRES_PASSWORD=123456

   ````

2. raiz añadir "docker-compose.yml"  para trabajar con mongo docker. Abrir docker desktop:

````
version: '3.8'


services:

  mongo-db:
    image: mongo:6.0.6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASS}
    volumes:
      - ./mongo:/data/db
    ports:
      - 27017:27017

  postgres-db:
    image: postgres:15.3
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./postgres:/var/lib/postgresql/data
    ports:
      - 5432:5432


````