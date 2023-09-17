
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ['usuario', 'admin'], 
    default: 'usuario' 
  }
});

export default mongoose.model('User', userSchema);
