import React, { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer, NavigateAction, View } from "react-big-calendar";
//import moment from "moment";
import moment, { unitOfTime } from "moment-timezone"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchGoogleCalendar } from "@/utils/services/turnx/forms";

const localizer = momentLocalizer(moment);
interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  userId: string;
}

interface GoogleDateTime {
  dateTime?: string;
  timeZone?: string;
  date?: string;
}

interface IncomingEvent {
  id: string;
  title: string;
  start: GoogleDateTime;
  end: GoogleDateTime;
  summary: string;
}

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currView, setCurrentView] = useState<View>('month');

  const fetchEvents = useCallback(async (query: string = "") => {
    try {
      const { data }: { data: Record<string, IncomingEvent[]> } = await fetchGoogleCalendar(query);

      const getDate = (date: GoogleDateTime) => {
        return date.timeZone
          ? moment.tz(date.dateTime, date.timeZone).toDate()
          : moment(date.date ?? '').toDate();
      }

      const formattedEvents = Object.entries(data).flatMap((entry: [string, IncomingEvent[]]): Event[] => {
        const [userId, events] = entry;

        return events.map((value): Event => {
          const start = getDate(value.start);
          const end = getDate(value.end);

          return ({
            id: value.id,
            start,
            end,
            title: value.summary,
            userId,
          })
        });
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRangeChange = useCallback((range: Date[] | { start: Date; end: Date }, view?: View) => {
    
    const { start, end } = Array.isArray(range)
      ? { start: range[0], end: range.at(-1) }
      : range;

    const query = new URLSearchParams({
      start: start.toISOString(),
      end: end!.toISOString(),
    }).toString();

    fetchEvents(query);
  }, [fetchEvents]);

  return (
    <>
      <h3 className="text-xl py-2 px-4 bg-blue-500 text-white mb-5">
        Schedule for this {currView}
      </h3>
      <div style={{ height: "700px" }} className="border-2 p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onRangeChange={handleRangeChange}
          style={{ height: "100%" }}
          onView={setCurrentView}
        />
      </div>
    </>
  );
};

export default MyCalendar;
