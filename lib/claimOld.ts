
import { User } from "better-auth";
import connectDB from '@/lib/mongodb';
import OldUsers, { IOldUsers } from '@/app/models/oldusers';
import Participant, { IParticipant } from '@/app/models/participant';
import Beer, { IBeer } from '@/app/models/beer';

export async function convertOldUserToNewAccount(user: User) {
  console.log("convertOldUserToNewAccount", user);
  await connectDB();

  const oldUser: IOldUsers | null = await OldUsers.findOne({ email: user.email });

  if (oldUser) {
    console.log("OLD USER FOUND:", user.email);
    await OldUsers.updateOne({ _id: oldUser._id }, { $set: { "claimedBy": user.id } });
    await Beer.updateMany({ user: oldUser._id }, { user: user.id });
    await Participant.updateMany({ user: oldUser._id }, { user: user.id });



  }
}
