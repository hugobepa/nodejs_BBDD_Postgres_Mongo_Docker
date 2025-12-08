//https://hub.docker.com/_/mongo
//https://hub.docker.com/_/postgres
//https://mongoosejs.com/
//https://mongoosejs.com/docs/index.html

//https://7sabores.com/blog/mi-primera-aplicacion-con-nexts-y-mongodb
//https://dev.to/dee_codes/how-to-set-up-mongodb-with-nextjs-2lkb
//https://medium.com/@pareekpnt/how-to-connect-mongodb-with-next-js-a-complete-guide-3adab2a9f37b
//https://dev.to/dee_codes/how-to-set-up-mongodb-with-nextjs-2lkb
//https://www.youtube.com/watch?v=NHxpn5F431w&pp=ygUVbmV4dCBtb25nbyBjYXN0ZWxsYW5v 32 min conexion next
//https://www.youtube.com/watch?v=TB6rpo3bp5M&pp=ygUVbmV4dCBtb25nbyBjYXN0ZWxsYW5v 22min conexion next
//https://www.youtube.com/watch?v=CkiuF2wsPRg&pp=ygUVbmV4dCBtb25nbyBjYXN0ZWxsYW5v  crud (1:40 h/min) next

0. gitignore:

    ````
    .env

    mongo/

    ````


1. env:

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

2. añdir " --clear " en package.json:

```
"scripts": {
    "dev": "tsnd --respawn --clear src/app.ts",

```

3. raiz añadir "docker-compose.yml"  para trabajar con mongo docker. Abrir docker desktop:

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


````

4. comprobar docker: docker --version

5. instalar y levantar docker mongo, terminal: docker compose up 

6. instalar y levantar docker mongo detach (terminal libre), terminal: docker compose up -d

7. trabajar con mongo " https://www.mongodb.com/products/tools/compass ": llamar mongodb compass

                --crear nueva connexion (uri): mongodb://localhost:27017

                adv conexxion opt: authentication(poner las variables de entorno)
                                        --username
                                        --password
                arriba verificar que se ha creado cadena de conexion (usery password)
                save & connect
                name: noc-mongo

                despues de conectar en lateral: localhost:27017, ... y coger "copy connection string".

8. ir a  ".env" y copiarlo en " MONGO_URL= ": MONGO_URL=mongodb://fernando:123456@localhost:27017

-----NODEJS-----

9.  "src/config/plugins/env.plugins":

````

import 'dotenv/config';
import * as env from 'env-var';


export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asEmailString(),
  MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
  PROD: env.get('PROD').required().asBool(),

  // Mongo DB
  MONGO_URL: env.get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
  MONGO_USER: env.get('MONGO_USER').required().asString(),
  MONGO_PASS: env.get('MONGO_PASS').required().asString(),
}

````

10.  crear directorios: "src/data/mongo" y "src/data/postgres"

11. install moogose, terminal proy: npm install mongoose

12.  en  "src/data/mongo" crear "init.ts":

````
import mongoose from 'mongoose';

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}


export class MongoDatabase {

  static async connect( options: ConnectionOptions ) {
    const { mongoUrl, dbName } = options;

    try {
      
      await mongoose.connect( mongoUrl, {
        dbName: dbName,
      });

      console.log('Mongo connected!');


    } catch (error) {
      console.log('Mongo connection error');
      throw error;
    }

  }

}

````

13. src/app.ts :

````

//import { PrismaClient } from '@prisma/client';
import { envs } from './config/plugins/envs.plugin';
import { MongoDatabase } from './data/mongo';
import { Server } from './presentation/server';


(async() => {
  main();
})();


async function main(){

  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });


  //Server.start();
}

````

14. crear fichero barril en   en  "src/data/mongo/index.ts":

````
  export * from './init'
  //export * from  './models/log.model'
````

15. comprobar connexion, terminal: npm run dev

16. crear carpeta models "src/data/mongo/models" y crear dentro de models "log.model.ts":

````

import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  
  message: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
  },
  level: {
    type: String,
    enum: ['low','medium','high'],
    default: 'low'
  },
  createdAt: {
    type: Date,
    default: new Date()
  },

});


export const LogModel = mongoose.model('Log', logSchema );


````

17. añadir en "src/app":

````

  //crear una collecion =tables,documento = registro

  const newLog = await LogModel.create({
    message: 'test message desde mongo',
    origin: 'App.ts',
    level: 'low'
  })

   await newLog.save()
   
      console.log({newLog})

  //Server.start();

````

18. ejecutar "newlog" terminal: ctrl + s

19. compas mongo ctrl +r y comprobar la introducciond de datos

20. extraer datos de BBD scr/app.ts:

````
// await newLog.save()
  //console.log({newLog})

  //extraer datos BBDD
  const logs = await LogModel.find();
  console.log({logs})
````
21.  ctrls+ s en terminal y verlos

22. ver unos solo:

````
console.log(logs[1].messsage)
````

23. añadir a "log.entity.ts":

````
 return log;
  };


  static fromObject = ( object: { [key: string]: any } ): LogEntity => {
    const { message, level, createdAt, origin } = object;
    const log = new LogEntity({
      message, level, createdAt, origin
    });
    return log;
  }

````




24. crear datasource "infrastucture/datasources/mongo-log.datasource.ts":

````
import { LogModel } from '../../data/mongo';
import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';


export class MongoLogDatasource implements LogDatasource {
  
  async saveLog( log: LogEntity ): Promise<void> {
    const newLog = await LogModel.create(log);
    // await newLog.save();
    console.log('Mongo Log created:', newLog.id ); 
  }

  async getLogs( severityLevel: LogSeverityLevel ): Promise<LogEntity[]> {
    
    const logs = await LogModel.find({
      level: severityLevel
    });

    return logs.map( LogEntity.fromObject );
  }

}


````

25. descomentar server.star en src/app.ts:

````
async function main(){

  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });


  
  Server.start();
````


OJO section 21 semillas: