import React from 'react';

/**
 * Skeleton Loader Components
 * Used during data loading states
 */

export const RestaurantCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card">
      <div className="skeleton h-48 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-4 w-20 rounded"></div>
          <div className="skeleton h-4 w-24 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const FoodCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-card flex">
      <div className="skeleton h-28 w-28"></div>
      <div className="flex-1 p-4 space-y-2">
        <div className="skeleton h-5 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-20 rounded"></div>
      </div>
    </div>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-card space-y-4">
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-1/3 rounded"></div>
        <div className="skeleton h-6 w-24 rounded-full"></div>
      </div>
      <div className="skeleton h-4 w-1/2 rounded"></div>
      <div className="skeleton h-4 w-1/4 rounded"></div>
    </div>
  );
};

export default {
  RestaurantCardSkeleton,
  FoodCardSkeleton,
  OrderCardSkeleton
};
