const mongoose = require('mongoose');

const personalInformationSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  province: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
});
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  personalInformation: personalInformationSchema
});

const User = mongoose.model('user', UserSchema);
const PersonalInfo = mongoose.model('address', personalInformationSchema);

module.exports = {
  User,
  PersonalInfo,
};
