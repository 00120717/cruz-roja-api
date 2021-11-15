import { createConnection, useContainer, ConnectionOptions, getConnectionOptions } from 'typeorm';
import { Container } from 'typedi';

const getOptions = async () => {
  let connectionOptions: ConnectionOptions;
  connectionOptions = {
    type: 'mysql',
    synchronize: getBoolean(process.env.DATABASE_SYNC),
    logging: true,
    //entities: ['dist/src/entities/**/*.js'],
    host: process.env.DATABASE_URL,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['src/entities/**/*.ts', 'dist/entities/**/*.js'],
    migrations: ['src/migrations/**/*.ts', 'dist/migrations/**/*.ts'],
    cli: {
      migrationsDir: 'src/migrations',
      entitiesDir: 'src/entities'
    }
  };
  if (process.env.DATABASE_URL) {
    Object.assign(connectionOptions);
  } else {
    connectionOptions = await getConnectionOptions();
  }
  return connectionOptions;
}

function getBoolean(value){
  switch(value){
       case true:
       case "true":
       case 1:
       case "1":
       case "on":
       case "yes":
           return true;
       default: 
           return false;
   }
}

export const connectDB = async () => {
  useContainer(Container);
  const typeormConfig = await getOptions();
  return await createConnection(typeormConfig);
};