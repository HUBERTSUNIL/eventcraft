import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Bell, X } from 'lucide-react';
import { useEventStore } from '../store/eventStore';

export function Calendar() {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState(false);
  const { events, createEvent } = useEventStore();

  const handleCreateEvent = async () => {
    if (!selectedDate || !title) return;

    const startTime = new Date(selectedDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(selectedDate);
    endTime.setHours(23, 59, 59, 999);

    await createEvent({
      title,
      description,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      reminder,
    });

    setTitle('');
    setDescription('');
    setReminder(false);
    setShowEventModal(false);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
    setShowEventModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          {format(today, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="date"
              onChange={handleDateSelect}
              className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowEventModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Event
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-sm py-2"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, i) => {
          const dayEvents = events.filter(event => 
            isSameDay(parseISO(event.start_time), day)
          );
          
          return (
            <div
              key={i}
              onClick={() => handleDayClick(day)}
              className={`
                p-2 text-center border rounded-lg cursor-pointer transition min-h-[80px]
                ${
                  format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                    ? 'bg-blue-100 border-blue-300'
                    : 'hover:bg-gray-50'
                }
              `}
            >
              <span className="text-sm block mb-1">{format(day, 'd')}</span>
              {dayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="text-xs p-1 bg-blue-50 rounded mb-1 truncate"
                  title={event.title}
                >
                  {event.reminder && <Bell className="h-3 w-3 inline mr-1" />}
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Create Event for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  placeholder="Event description"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={reminder}
                  onChange={(e) => setReminder(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="reminder" className="ml-2 block text-sm text-gray-700">
                  Set reminder
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}