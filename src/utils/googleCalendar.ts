export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence: string[];
  reminders: {
    useDefault: false;
    overrides: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export const addToGoogleCalendar = (
  medicationName: string,
  dosage: string,
  times: string[],
  startDate: string
) => {
  const calendarEvents: CalendarEvent[] = times.map(time => {
    const [hours, minutes] = time.split(':');
    const startDateTime = new Date(startDate);
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 15); // 15 min event

    return {
      summary: `💊 Take ${medicationName}`,
      description: `Reminder to take ${medicationName} (${dosage})`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recurrence: ['RRULE:FREQ=DAILY'], // Repeat daily
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 0 }, // At event time
          { method: 'popup', minutes: 15 }, // 15 min before
        ],
      },
    };
  });

  // Create Google Calendar URL for each event
  calendarEvents.forEach(event => {
    const calendarUrl = createGoogleCalendarUrl(event);
    window.open(calendarUrl, '_blank');
  });
};

const createGoogleCalendarUrl = (event: CalendarEvent): string => {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.summary,
    details: event.description,
    dates: `${formatDateForGoogle(event.start.dateTime)}/${formatDateForGoogle(event.end.dateTime)}`,
    recur: event.recurrence[0],
    ctz: event.start.timeZone,
  });

  return `${baseUrl}?${params.toString()}`;
};

const formatDateForGoogle = (isoDate: string): string => {
  return isoDate.replace(/[-:]/g, '').split('.')[0] + 'Z';
};