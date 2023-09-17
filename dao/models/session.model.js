
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: String,
  username: String
});

export default mongoose.model('Session', sessionSchema);
