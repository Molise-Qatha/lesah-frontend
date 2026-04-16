// src/components/Delivery/DeliveryForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryRequestSchema } from '../../utils/validation';

const DeliveryForm = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(deliveryRequestSchema),
    defaultValues: {
      scheduled_time: new Date().toISOString().split('T')[0],
      item_weight: 'light',
      confirm_legal: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="delivery-form">
      <h2>📦 Request Delivery</h2>

      <div className="form-row">
        <div className="input-group">
          <input
            {...register('pickup_location')}
            placeholder="Pickup Location"
            className={errors.pickup_location ? 'error' : ''}
          />
          {errors.pickup_location && (
            <span className="error-message">{errors.pickup_location.message}</span>
          )}
        </div>
        <div className="input-group">
          <input
            {...register('dropoff_location')}
            placeholder="Drop-off Location"
            className={errors.dropoff_location ? 'error' : ''}
          />
          {errors.dropoff_location && (
            <span className="error-message">{errors.dropoff_location.message}</span>
          )}
        </div>
      </div>

      <div className="input-group">
        <textarea
          {...register('item_description')}
          placeholder="Item Description (e.g., Laptop, Textbooks, Food)"
          rows="3"
          className={errors.item_description ? 'error' : ''}
        />
        {errors.item_description && (
          <span className="error-message">{errors.item_description.message}</span>
        )}
      </div>

      <div className="form-row">
        <select {...register('item_weight')}>
          <option value="light">Light (&lt; 2kg)</option>
          <option value="medium">Medium (2-10kg)</option>
          <option value="heavy">Heavy (10-30kg)</option>
          <option value="large">Large (&gt; 30kg)</option>
        </select>
        <input type="date" {...register('scheduled_time')} />
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" {...register('confirm_legal')} />
          <span>I confirm that the items are legal and properly packaged</span>
        </label>
        {errors.confirm_legal && (
          <span className="error-message">{errors.confirm_legal.message}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;