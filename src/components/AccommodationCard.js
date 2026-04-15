import React from 'react';

export default function AccommodationCard({ accommodation }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <img 
        src={accommodation.image} 
        alt={accommodation.name} 
        className="w-full h-48 object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800">{accommodation.name}</h3>
          <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
            ⭐ {accommodation.rating}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4 flex items-center">
          📍 {accommodation.location}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-teal-600 font-bold text-lg">
            M{accommodation.price.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ month</span>
          </span>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}