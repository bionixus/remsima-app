
import { addWeeks, format, isAfter, startOfDay } from 'date-fns';

export interface Dose {
    id: string;
    type: 'IV' | 'SC';
    date: Date;
    status: 'pending' | 'taken' | 'missed';
}

/**
 * Calculates the Remsima SC schedule based on the last IV dose.
 * Standard protocol: Start SC 8 weeks after the last IV dose, then every 2 weeks.
 */
export function calculateSchedule(lastIvDate: Date, count: number = 10): Dose[] {
    const schedule: Dose[] = [];

    // Last IV Dose
    schedule.push({
        id: 'iv-last',
        type: 'IV',
        date: lastIvDate,
        status: 'taken'
    });

    // First SC Dose (8 weeks after last IV)
    const firstScDate = addWeeks(lastIvDate, 8);

    for (let i = 0; i < count; i++) {
        const scDate = addWeeks(firstScDate, i * 2);
        schedule.push({
            id: `sc-${i}`,
            type: 'SC',
            date: scDate,
            status: isAfter(startOfDay(new Date()), startOfDay(scDate)) ? 'taken' : 'pending'
        });
    }

    return schedule;
}

export function getNextDose(schedule: Dose[]): Dose | undefined {
    const now = startOfDay(new Date());
    return schedule.find(dose => dose.type === 'SC' && (isAfter(dose.date, now) || format(dose.date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')));
}
