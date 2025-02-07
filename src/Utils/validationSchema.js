import * as Yup from 'yup';

// Common validation rules
const nameSchema = Yup.string()
  .min(3, 'Name must be at least 3 characters')
  .max(50, 'Name must be less than 50 characters')
  .required('Name is required');

const emailSchema = Yup.string()
  .email('Invalid email format')
  .required('Email is required');

const phoneSchema = Yup.string()
  .matches(/^[0-9]+$/, 'Phone number must contain only digits')
  .min(7, 'Phone number must be at least 7 digits')
  .max(15, 'Phone number must be less than 15 digits')
  .required('Phone number is required');

const passwordSchema = Yup.string()
  .min(6, 'Password must be at least 6 characters')
  .required('Password is required');

const confirmPasswordSchema = Yup.string()
  .oneOf([Yup.ref('password'), null], 'Passwords must match')
  .required('Confirm Password is required');

const referalCodeSchema = Yup.string()
  .optional()
  .matches(/^[a-zA-Z0-9]*$/, 'Referral code must be alphanumeric');

// Validation schemas
export const createAccountSchema = Yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  referalCode: referalCodeSchema,
});

export const loginSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

export const loginWithPhoneSchema = Yup.object().shape({
  phone: phoneSchema,
});
