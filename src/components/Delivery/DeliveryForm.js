// src/components/Delivery/DeliveryForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const ZONES = ['Roma', 'Maseru', 'Mafeteng'];

const PRICE_MATRIX = {
  'Roma-Roma': 350,
  'Maseru-Maseru': 350,
  'Mafeteng-Mafeteng': 350,
  'Roma-Maseru': 700,
  'Maseru-Roma': 700,
  'Roma-Mafeteng': 1200,
  'Mafeteng-Roma': 1200,
  'Maseru-Mafeteng': 1200,
  'Mafeteng-Maseru': 1200,
};

const deliverySchema = z.object({
  // Original location fields – free text
  pickup_location: z.string().min(3, 'Pickup location is required'),
  dropoff_location: z.string().min(3, 'Drop‑off location is required'),

  // New zone fields (used for pricing, optional if you want to enforce them)
  pickup_zone: z.string().optional(),
  dropoff_zone: z.string().optional(),

  item_description: z.string().min(5, 'Please describe the item'),
  item_weight: z.enum(['light', 'medium', 'heavy', 'large']),
  scheduled_time: z.string().min(1, 'Date is required'),
  confirm_legal: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm' }),
  }),
});

const DeliveryForm = ({ onSubmit, onCancel }) => {
  const [pickupZone, setPickupZone] = useState('');
  const [dropoffZone, setDropoffZone] = useState('');
  const [price, setPrice] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      scheduled_time: new Date().toISOString().split('T')[0],
      item_weight: 'light',
    },
  });

  useEffect(() => {
    if (pickupZone && dropoffZone) {
      const key = `${pickupZone}-${dropoffZone}`;
      setPrice(PRICE_MATRIX[key] || 0);
    } else {
      setPrice(0);
    }
  }, [pickupZone, dropoffZone]);

  const onFormSubmit = (data) => {
    // Include zones in the payload
    const payload = {
      ...data,
      pickup_zone: pickupZone,
      dropoff_zone: dropoffZone,
      price: price,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="delivery-form">
      <h2>📦 Request Delivery</h2>

      {/* Original location text inputs (kept exactly) */}
      <div className="form-row">
        <div className="input-group">
          <input
            {...register('pickup_location')}
            placeholder="Detailed Pickup Address"
          />
          {errors.pickup_location && <span className="error-text">{errors.pickup_location.message}</span>}
        </div>
        <div className="input-group">
          <input
            {...register('dropoff_location')}
            placeholder="Detailed Drop‑off Address"
          />
          {errors.dropoff_location && <span className="error-text">{errors.dropoff_location.message}</span>}
        </div>
      </div>

      {/* Zone selectors for pricing */}
      <div className="form-row">
        <div className="input-group">
          <label>Pickup Zone (for price)</label>
          <select
            value={pickupZone}
            onChange={(e) => setPickupZone(e.target.value)}
          >
            <option value="">Select zone</option>
            {ZONES.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Drop‑off Zone (for price)</label>
          <select
            value={dropoffZone}
            onChange={(e) => setDropoffZone(e.target.value)}
          >
            <option value="">Select zone</option>
            {ZONES.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>

      {price > 0 && (
        <div className="price-display">
          💰 Estimated price: <strong>M{price}</strong>
        </div>
      )}

      <div className="input-group">
        <textarea
          {...register('item_description')}
          placeholder="Item Description (e.g., Laptop, Textbooks)"
          rows="3"
        />
        {errors.item_description && <span className="error-text">{errors.item_description.message}</span>}
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
        {errors.confirm_legal && <span className="error-text">{errors.confirm_legal.message}</span>}
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
