import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import config from './ormconfig'

const ormseedconfig: MysqlConnectionOptions = {
  ...config,
  migrations: [__dirname + '/../seeds/**/*{.ts,.js}']
}

export default ormseedconfig
