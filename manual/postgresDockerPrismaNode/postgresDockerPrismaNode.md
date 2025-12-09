//https://hub.docker.com/_/postgres
//https://www.prisma.io/
//https://www.prisma.io/docs/getting-started
//https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql (bueno)
//https://github.com/prisma/prisma
//https://typeorm.io/
//https://medium.com/@david.zhao.blog/fix-option-suppressimplicitanyindexerrors-is-deprecated-and-will-stop-functioning-in-typescript-cee57e142028

0. gitignore:

    ````
    .env

    mongo/
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

3. crear y levantar BBDD en docker, terminal: docker compose up -d

4. abrir tablesPlus---create conexion---postgres(copiar usurio, contrasenya,nombreBBDD de ".env"):
                      name: NOC-Postgrest
                      user:
                      password:
                      database:

                      test (ok o verde)
                      connect

#https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql (bueno)
#https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
#https://github.com/prisma/prisma

5. instalar prisma, terminal: npm install prisma @types/node @types/pg --save-dev 
                              npm install @prisma/client @prisma/adapter-pg pg dotenv

6. actualizar "ts.config", y comentar los campos duplicadosque habia antes:

````
"compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
````

error "Invalid value for '--ignoreDeprecations'.", eliminar del tsconfig.ts:

````
"ignoreDeprecations": "6.0",
````

7. package.jon añadir "  "type": "module",  ":

````
    

     "name": "05-noc",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
   "type": "module",
````

8. llamar a prisma, terminal:  npx prisma
9. setup prisma: npx prisma init --datasource-provider postgresql
                //npx prisma init --datasource-provider postgresql --output ../generated/prisma

````
CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.
````
se han creado "prisma.config.ts" y "prisma/schema.prisma"


8. cambiar en "prisma.config.ts" nuestra varable de entorno:

````
datasource: {
    //url: env("DATABASE_URL"),
    url: env("POSTGRES_URL"),
    
  },
````


8. error "Invalid value for '--ignoreDeprecations'.", eliminar del tsconfig.ts:

````
"ignoreDeprecations": "6.0",
````

9. añadir .env Y .env.template:

````
#DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
POSTGRES_URL="postgresql://postgres:123456@localhost:5432/NOC"
````

10. define tablas de BBDD en "prisma/schema.prisma":

````
enum SeverityLevel {
  LOW
  MEDIUM
  HIGH
}

model LogModel {
  id        Int           @id @default(autoincrement())
  message   String
  origin    String
  level     SeverityLevel
  createdAt DateTime      @default(now())
}

````

11.  migracion y creacion de BBDD,repositorio: npx prisma migrate dev --name primeraMigracion

````
prisma\migrations/
  └─ 20251209112009_primera_migracion/
    └─ migration.sql

Your database is now in sync with your schema.

````

12. generar cliente prisma: npx prisma generate

````
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (7.1.0) to .\generated\prisma in 41ms

````

