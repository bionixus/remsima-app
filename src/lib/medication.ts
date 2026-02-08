
import { addWeeks, format, isAfter, startOfDay } from 'date-fns';

export interface Dose {
    id: string;
    type: 'IV' | 'SC';
    date: Date;
    status: 'pending' | 'taken' | 'missed';
    /** Custom date override set by the user (ISO string in storage) */
    customDate?: Date;
    /** Injection site, if logged */
    site?: string;
}

// ─── Storage keys ────────────────────────────────────────────────
const STORAGE_KEY_IV_DATE = 'hikma:lastIvDate';
const STORAGE_KEY_DOSE_OVERRIDES = 'hikma:doseOverrides';

// ─── localStorage helpers ────────────────────────────────────────
export function getStoredIvDate(): Date | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY_IV_DATE);
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
}

export function setStoredIvDate(date: Date) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_IV_DATE, date.toISOString());
    // Clear any old dose overrides when the IV date changes (schedule recalculated)
    localStorage.removeItem(STORAGE_KEY_DOSE_OVERRIDES);
    // Dispatch event so other open tabs / components can react
    window.dispatchEvent(new Event('hikma:schedule-updated'));
}

export interface DoseOverride {
    status?: 'taken' | 'pending' | 'missed';
    customDate?: string; // ISO
    site?: string;
}

export function getStoredDoseOverrides(): Record<string, DoseOverride> {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(STORAGE_KEY_DOSE_OVERRIDES);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
}

export function setDoseOverride(doseId: string, override: DoseOverride) {
    const current = getStoredDoseOverrides();
    current[doseId] = { ...current[doseId], ...override };
    localStorage.setItem(STORAGE_KEY_DOSE_OVERRIDES, JSON.stringify(current));
    window.dispatchEvent(new Event('hikma:schedule-updated'));
}

// ─── Schedule calculation ────────────────────────────────────────
/**
 * Calculates the Remsima SC schedule based on the last IV dose.
 * Protocol: First SC dose **4 weeks** after the last IV, then every **2 weeks**.
 */
export function calculateSchedule(lastIvDate: Date, count: number = 12): Dose[] {
    const schedule: Dose[] = [];
    const overrides = getStoredDoseOverrides();

    // Last IV Dose
    schedule.push({
        id: 'iv-last',
        type: 'IV',
        date: lastIvDate,
        status: 'taken',
    });

    // First SC Dose → 4 weeks after last IV, then every 2 weeks
    const firstScDate = addWeeks(lastIvDate, 4);

    for (let i = 0; i < count; i++) {
        const baseDate = addWeeks(firstScDate, i * 2);
        const ov = overrides[`sc-${i}`];
        const doseDate = ov?.customDate ? new Date(ov.customDate) : baseDate;

        // Determine status: respect user override first, then auto-detect past dates
        let status: Dose['status'] = 'pending';
        if (ov?.status) {
            status = ov.status;
        } else if (isAfter(startOfDay(new Date()), startOfDay(doseDate))) {
            status = 'pending'; // past doses stay pending until explicitly marked
        }

        schedule.push({
            id: `sc-${i}`,
            type: 'SC',
            date: doseDate,
            status,
            site: ov?.site,
        });
    }

    return schedule;
}

export function getNextDose(schedule: Dose[]): Dose | undefined {
    const now = startOfDay(new Date());
    return schedule.find(dose =>
        dose.type === 'SC' &&
        dose.status === 'pending' &&
        (isAfter(dose.date, now) || format(dose.date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'))
    );
}
