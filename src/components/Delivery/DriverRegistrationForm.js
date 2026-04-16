// src/components/Delivery/DriverRegistrationForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverRegistrationSchema } from '../../utils/validation';
import { formatPhoneNumber } from '../../utils/formatters';

const SERVICE_AREAS = [
  "Roma Central",
  "NUL Campus",
  "Roma Hospital Area",
  "Roma Taxi Rank",
  "St. Augustine Area",
  "Lower Roma",
  "Upper Roma",
  "Mazenod",
  "Mafeteng Road"
];

const DriverRegistrationForm = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(driverRegistrationSchema),
    defaultValues: {
      experience_years: '0',
      area_covered: SERVICE_AREAS[0],
      is_online: false,
      has_license: false,
      has_insurance: false,
      knows_area: false,
    },
  });

  const isOnline = watch('is_online');

  const handleFormSubmit = (data) => {
    // Format phone number before submission
    const formattedData = {
      ...data,
      phone_number: formatPhoneNumber(data.phone_number),
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="delivery-form">
      <h2>🚚 Become a Delivery Partner</h2>

      <div className="form-row">
        <div className="input-group">
          <input
            {...register('full_name')}
            placeholder="Full Name"
            className={errors.full_name ? 'error' : ''}
          />
          {errors.full_name && <span className="error-message">{errors.full_name.message}</span>}
        </div>
        <div className="input-group">
          <input
            {...register('phone_number')}
            placeholder="Phone Number (e.g., 56613551)"
            className={errors.phone_number ? 'error' : ''}
          />
          {errors.phone_number && (
            <span className="error-message">{errors.phone_number.message}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <input
            {...register('vehicle_type')}
            placeholder="Vehicle Type (Car, Van, Motorcycle)"
            className={errors.vehicle_type ? 'error' : ''}
          />
          {errors.vehicle_type && (
            <span className="error-message">{errors.vehicle_type.message}</span>
          )}
        </div>
        <div className="input-group">
          <input
            {...register('vehicle_registration')}
            placeholder="Vehicle Registration Number"
            className={errors.vehicle_registration ? 'error' : ''}
          />
          {errors.vehicle_registration && (
            <span className="error-message">{errors.vehicle_registration.message}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <select {...register('experience_years')}>
          <option value="0">Less than 1 year</option>
          <option value="1">1-2 years</option>
          <option value="2">2-3 years</option>
          <option value="3">3-5 years</option>
          <option value="5">5+ years</option>
        </select>
        <select {...register('area_covered')}>
          {SERVICE_AREAS.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <div className="online-toggle">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => setValue('is_online', e.target.checked)}
          />
          <span>🚀 Available for deliveries immediately</span>
        </label>
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" {...register('has_license')} />
          <span>I have a valid driver's license</span>
        </label>
        {errors.has_license && <span className="error-message">{errors.has_license.message}</span>}

        <label className="checkbox-label">
          <input type="checkbox" {...register('has_insurance')} />
          <span>I have valid vehicle insurance</span>
        </label>
        {errors.has_insurance && <span className="error-message">{errors.has_insurance.message}</span>}

        <label className="checkbox-label">
          <input type="checkbox" {...register('knows_area')} />
          <span>I know the Roma area well</span>
        </label>
        {errors.knows_area && <span className="error-message">{errors.knows_area.message}</span>}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Registering...' : 'Register as Driver'}
        </button>
      </div>
    </form>
  );
};

export default DriverRegistrationForm;