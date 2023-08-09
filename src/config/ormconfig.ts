import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { config as conf } from 'dotenv'

conf()

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}']
}

export default config
