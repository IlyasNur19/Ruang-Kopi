import React from 'react';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';

const ReservationCalendar = ({ selected, onSelect, disabledDates = [] }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);

    const isPastDay = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d < today;
    };

    const isDisabledDate = (date) => {
        return disabledDates.some((d) => {
            const disabled = new Date(d);
            return (
                disabled.getFullYear() === date.getFullYear() &&
                disabled.getMonth() === date.getMonth() &&
                disabled.getDate() === date.getDate()
            );
        });
    };

    return (
        <div className="flex flex-col items-center">
            <Calendar
                mode="single"
                selected={selected}
                onSelect={onSelect}
                disabled={(date) => isPastDay(date) || date > maxDate || isDisabledDate(date)}
                startMonth={today}
                endMonth={maxDate}
                className="rounded-xl border border-[#3E2723]/10 bg-white shadow-sm"
            />
            <p className="text-xs text-[#6D4C41]/60 mt-3">
                Reservasi dapat dilakukan maksimal 30 hari ke depan
            </p>
        </div>
    );
};

export default ReservationCalendar;
