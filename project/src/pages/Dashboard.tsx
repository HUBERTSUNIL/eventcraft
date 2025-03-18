import React from 'react';
import { Calendar } from '../components/Calendar';

export function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <Calendar />
    </div>
  );
}