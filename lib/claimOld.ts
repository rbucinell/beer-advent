
import { User } from "better-auth";
import connectDB from '@/lib/mongodb';
import OldUsers, { IOldUsers } from '@/app/models/oldusers';
import Participant, { IParticipant } from '@/app/models/participant';
import Beer, { IBeer } from '@/app/models/beer';
import { Types } from "mongoose";

export async function convertOldUserToNewAccount(user: User) {
  console.log("convertOldUserToNewAccount");

  console.log( 'new user', user);
  await connectDB();
  const oldUser: IOldUsers | null = await OldUsers.findOne({ email: user.email });

  if (oldUser) {

    await Beer.updateMany(
      { user: oldUser._id }, 
      { $set: { user: new Types.ObjectId(user.id) } }
    );

    await Participant.updateMany(
      { user: oldUser._id }, 
      { $set: { user: new Types.ObjectId(user.id) } }
    );

    await OldUsers.findByIdAndDelete( oldUser._id );

  }
}
