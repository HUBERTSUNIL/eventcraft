import React from 'react';
import { Calendar as CalendarIcon, Users, Bell, Globe } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Calendar App</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-center mb-8">
            <CalendarIcon className="h-16 w-16 text-blue-600" />
          </div>
          
          <p className="text-gray-600 text-lg mb-8 text-center">
            A collaborative calendar application that helps teams and individuals manage their schedules effectively.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">Share schedules and coordinate with team members across different locations.</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reminders</h3>
              <p className="text-gray-600">Set reminders for important events and never miss a meeting.</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
              <p className="text-gray-600">Access your calendar from anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}