import { Global, Module } from '@nestjs/common';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises'; // ① new

@Global()
@Module({
  providers: [
    {
      provide: 'MONGO_SERVER',
      useFactory: async () => {
        const dbPath = path.resolve(os.tmpdir(), 'mongo-mem'); //pick one fixed path in %TEMP% (or /tmp) 
        await fs.rm(dbPath, { recursive: true, force: true }); //hard delete any leftovers from previous crashes

        /*  C) recreate the empty folder so scandir succeeds   */
        await fs.mkdir(dbPath, { recursive: true });


        const replSet = await MongoMemoryReplSet.create({ //start the in-memory replica set
          instanceOpts: [
            {
              dbPath,                       // reuses the same folder every run
              storageEngine: 'ephemeralForTest',
            },
          ],
          replSet: { storageEngine: 'ephemeralForTest' },
          /* Binary cache can still live in ~/.cache/mongodb-binaries
             or point it elsewhere with binary.downloadDir */
        });

        return replSet;
      },
    },
  ],
  exports: ['MONGO_SERVER'],
})
export class MemoryDbModule {}
