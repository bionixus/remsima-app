
import { format } from 'date-fns';
import type { Dose } from './medication';

// ─── ICS Calendar Export ─────────────────────────────────────────
// Generates .ics files that work with iOS Calendar, Google Calendar,
// Outlook, etc. — each event includes a built-in alarm so the phone
// rings/vibrates at the scheduled time.

function pad(n: number): string {
    return n.toString().padStart(2, '0');
}

function toIcsDate(d: Date): string {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function uid(): string {
    return `hikma-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@remsima`;
}

function buildEvent(dose: Dose, index: number): string {
    // Default reminder at 9:00 AM on dose day
    const doseDay = new Date(dose.date);
    doseDay.setHours(9, 0, 0, 0);
    const endTime = new Date(doseDay);
    endTime.setMinutes(endTime.getMinutes() + 30);

    const label = dose.type === 'IV'
        ? 'Remsima IV Infusion'
        : `Remsima SC Dose #${index}`;

    return [
        'BEGIN:VEVENT',
        `UID:${uid()}`,
        `DTSTART:${toIcsDate(doseDay)}`,
        `DTEND:${toIcsDate(endTime)}`,
        `SUMMARY:💉 ${label}`,
        `DESCRIPTION:Time for your ${dose.type === 'IV' ? 'IV infusion' : 'Remsima SC 120mg injection'}. Open Hikma to log it.`,
        'LOCATION:Home',
        // Alarm 1: at the time of the event
        'BEGIN:VALARM',
        'TRIGGER:PT0M',
        'ACTION:DISPLAY',
        `DESCRIPTION:${label} — time to take your dose`,
        'END:VALARM',
        // Alarm 2: 1 hour before
        'BEGIN:VALARM',
        'TRIGGER:-PT60M',
        'ACTION:DISPLAY',
        `DESCRIPTION:${label} in 1 hour`,
        'END:VALARM',
        // Alarm 3: day before at 8pm
        'BEGIN:VALARM',
        'TRIGGER:-PT13H',
        'ACTION:DISPLAY',
        `DESCRIPTION:${label} tomorrow morning`,
        'END:VALARM',
        'END:VEVENT',
    ].join('\r\n');
}

function wrapCalendar(events: string): string {
    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Hikma Remsima Care//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Remsima Dose Schedule',
        events,
        'END:VCALENDAR',
    ].join('\r\n');
}

/** Download a single dose as an .ics calendar event */
export function downloadDoseIcs(dose: Dose, index: number) {
    const ics = wrapCalendar(buildEvent(dose, index));
    triggerDownload(ics, `remsima-dose-${index}.ics`);
}

/** Download all pending SC doses as a single .ics file */
export function downloadAllDosesIcs(schedule: Dose[]) {
    const events = schedule
        .filter(d => d.type === 'SC' && d.status !== 'taken')
        .map((d, i) => buildEvent(d, schedule.indexOf(d)))
        .join('\r\n');
    const ics = wrapCalendar(events);
    triggerDownload(ics, 'remsima-schedule.ics');
}

function triggerDownload(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ─── Web Notifications ───────────────────────────────────────────
// Shows browser/OS notifications when the app is open. On mobile PWAs
// these appear as native-style notifications.

const NOTIF_PERMISSION_KEY = 'hikma:notifEnabled';

export function isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!isNotificationSupported()) return 'unsupported';
    return Notification.permission;
}

export function isNotificationEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(NOTIF_PERMISSION_KEY) === 'true';
}

export function setNotificationEnabled(enabled: boolean) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NOTIF_PERMISSION_KEY, String(enabled));
}

export async function requestNotificationPermission(): Promise<boolean> {
    if (!isNotificationSupported()) return false;
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setNotificationEnabled(granted);
    return granted;
}

export function showDoseNotification(dose: Dose, daysUntil: number) {
    if (!isNotificationSupported() || Notification.permission !== 'granted') return;

    const title = daysUntil === 0
        ? '💉 Dose Due Today!'
        : `💉 Dose in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;

    const body = daysUntil === 0
        ? 'Your Remsima SC 120mg injection is due today. Tap to log it.'
        : `Your next Remsima SC dose is on ${format(dose.date, 'EEEE, MMM dd')}. Stay on track!`;

    new Notification(title, {
        body,
        icon: '/hikma-logo.png',
        badge: '/hikma-logo.png',
        tag: 'hikma-dose-reminder', // deduplicates
        renotify: true,
    });
}
