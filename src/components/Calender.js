import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});
const GOOGLE_SHEET_URL =fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vT-42N3EOltb_6jVLMe1pw-BH7Vt38QBZh2DTI_JoVxClibp034Foc9IzzzVkuqCDULhyfhOXWDddyP/gviz/tq?tqx=out:json", { cache: 'no-store' })
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error loading data", error));


const Calender = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(GOOGLE_SHEET_URL)
      .then((res) => res.text())
      .then((data) => {
        const json = JSON.parse(data.substring(47).slice(0, -2));
        const rows = json.table.rows;

        const parsedEvents = rows.map((row) => {
          const title = row.c[0]?.v;
          const description = row.c[1]?.v;
          const date = row.c[2]?.v; // date in DD-MM-YYYY format
          const startTime = row.c[3]?.v;
          const endTime = row.c[4]?.v;

          if (!title || !date || !startTime || !endTime) return null;

          // Parse date from DD-MM-YYYY format using date-fns
          const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
          const start = new Date(`${parsedDate.toDateString()} ${startTime}`);
          const end = new Date(`${parsedDate.toDateString()} ${endTime}`);

          return {
            title: `${title}`,
            start,
            end,
            desc: description || '',
          };
        }).filter(Boolean); // Remove any null values

        console.log('Parsed Events:', parsedEvents);  // Check if the events are parsed correctly
        setEvents(parsedEvents);
      })
      .catch((err) => console.error('Error loading sheet data', err));
  }, []);

  return (
    <div style={{ width: '70%', height: '80vh', margin: 'auto', padding: '2rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        tooltipAccessor="desc"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default Calender;
