import { DispatchJobDocument } from 'src/dispatch/schema/dispatch-job.schema';
import { Drone } from 'src/drone/schemas/drone.schema';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      // dispatchJob?: DispatchJobDocument;
      drone: Drone & { _id: Types.ObjectId };
    }
  }
}
