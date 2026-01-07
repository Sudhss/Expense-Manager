import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true
    },
    passwordHash: { 
      type: String, 
      required: function() {
        return !this.isGoogleAuth; // Only required for non-Google auth users
      } 
    },
    avatar: { type: String },
    isGoogleAuth: { 
      type: Boolean, 
      default: false 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  }, 
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.passwordHash;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        return ret;
      }
    }
  }
);

// Index for faster querying
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
