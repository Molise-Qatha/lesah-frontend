// src/utils/validation.js
import { z } from 'zod';

// Helper: Lesotho phone number (8 digits, may start with 5 or 6)
const lesothoPhoneRegex = /^[56]\d{7}$/;

export const deliveryRequestSchema = z.object({
  pickup_location: z.string().min(3, 'Pickup location is required'),
  dropoff_location: z.string().min(3, 'Drop-off location is required'),
  item_description: z.string().min(5, 'Please describe the item'),
  item_weight: z.enum(['light', 'medium', 'heavy', 'large']),
  scheduled_time: z.string().min(1, 'Please select a date'),
  confirm_legal: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm the items are legal' }),
  }),
});

export const driverRegistrationSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone_number: z.string().regex(lesothoPhoneRegex, 'Enter a valid 8-digit Lesotho phone number (starts with 5 or 6)'),
  vehicle_type: z.string().min(2, 'Vehicle type is required'),
  vehicle_registration: z.string().optional(),
  experience_years: z.string(),
  area_covered: z.string().min(1, 'Select an area'),
  is_online: z.boolean(),
  has_license: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm you have a valid license' }),
  }),
  has_insurance: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm you have insurance' }),
  }),
  knows_area: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm you know the area' }),
  }),
});