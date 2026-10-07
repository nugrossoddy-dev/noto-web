import { Task } from '../types';

/**
 * Utility to format Date into iCal UTC / Local string (YYYYMMDDTHHmmss)
 */
function formatIcsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Converts a task and today's context into start and end Dates
 */
export function getTaskDateRange(task: Task): { start: Date; end: Date } {
  const start = new Date();
  
  if (task.timeframe === 'upcoming') {
    // If upcoming, set for tomorrow by default
    start.setDate(start.getDate() + 1);
  }

  if (task.dueTime) {
    const [h, m] = task.dueTime.split(':').map((v) => parseInt(v, 10));
    if (!isNaN(h) && !isNaN(m)) {
      start.setHours(h, m, 0, 0);
    }
  } else if (task.time) {
    const [h, m] = task.time.split(':').map((v) => parseInt(v, 10));
    if (!isNaN(h) && !isNaN(m)) {
      start.setHours(h, m, 0, 0);
    }
  } else {
    // Default to 14:00 today if unspecified
    start.setHours(14, 0, 0, 0);
  }

  const durationMin = task.durationMin || 45;
  const end = new Date(start.getTime() + durationMin * 60 * 1000);

  return { start, end };
}

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string for tasks
 */
export function generateIcs(tasks: Task[], calendarTitle = 'NOTO Workstation Schedule'): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NOTO Studio//NOTO Workstation v2.4//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarTitle}`,
    'X-WR-TIMEZONE:Asia/Jakarta',
  ];

  tasks.forEach((task) => {
    const { start, end } = getTaskDateRange(task);
    const startStr = formatIcsDate(start);
    const endStr = formatIcsDate(end);
    const uid = `noto-task-${task.id}@noto.id`;
    const summary = task.title.replace(/[\r\n]/g, ' ');
    const description = `Prioritas: ${task.priority || 'Medium'} | Kategori: ${
      task.category || 'Deep Work'
    } | Dibuat di NOTO Studio Workstation.`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `CATEGORIES:${task.category || 'WORK'}`,
      task.completed ? 'STATUS:COMPLETED' : 'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers client-side browser download for .ics file
 */
export function downloadIcsFile(tasks: Task[], filename = 'noto-tasks.ics') {
  if (tasks.length === 0) return;
  const icsData = generateIcs(tasks);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a direct web URL to add a task to Google Calendar in 1-click
 * (No OAuth permission required, opens directly in user's browser)
 */
export function getGoogleCalendarWebUrl(task: Task): string {
  const { start, end } = getTaskDateRange(task);
  const startStr = formatIcsDate(start);
  const endStr = formatIcsDate(end);

  const title = encodeURIComponent(task.title);
  const details = encodeURIComponent(
    `Prioritas: ${task.priority || 'Medium'}\nKategori: ${task.category || 'Deep Work'}\nDisinkronkan dari NOTO Workstation`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startStr}/${endStr}`;
}
