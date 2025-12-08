import { envs } from './config/plugins/envs.plugin';
import { MongoDatabase } from './data/mongo';
import { Server } from './presentation/server';
import { LogModel } from './data/mongo/models/log.model';


(async() => {
  main();
})();


async function main(){

  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });


  //crear una collecion =tables,documento = registro

  // const newLog = await LogModel.create({
  //   message: 'test message desde mongo',
  //   origin: 'App.ts',
  //   level: 'low'
  // })

  // await newLog.save()
  //console.log({newLog})

  //extraer datos BBDD
  // const logs = await LogModel.find();
  // console.log({logs})

  Server.start();
}


