// components/common/TimeSlotPicker.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TimeSlotPicker = ({ doctorId, date, onSlotSelect }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [lockedSlots, setLockedSlots] = useState({});

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            setLoading(true);
            try {
                // Simulate API call to get available slots
                const response = await fetch(`/api/doctors/${doctorId}/slots?date=${date}`);
                const data = await response.json();

                // Check for soft-locked slots
                const updatedSlots = data.map(slot => ({
                    ...slot,
                    isLocked: lockedSlots[`${date}-${slot.time}`] || false
                }));

                setSlots(updatedSlots);
            } catch (error) {
                console.error('Error fetching slots:', error);
                toast.error('Không thể tải lịch khám. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (doctorId && date) {
            fetchAvailableSlots();
        }
    }, [doctorId, date, lockedSlots]);

    const handleSlotSelect = (slot) => {
        if (slot.isLocked) {
            toast.warning('Khung giờ này đang được đặt bởi người khác. Vui lòng chọn khung giờ khác.');
            return;
        }

        // Soft lock the slot for 5 minutes
        const lockKey = `${date}-${slot.time}`;
        setLockedSlots(prev => ({ ...prev, [lockKey]: true }));

        // Release lock after 5 minutes if not confirmed
        const timer = setTimeout(() => {
            if (selectedSlot && selectedSlot.time === slot.time) return;
            setLockedSlots(prev => {
                const newLocks = { ...prev };
                delete newLocks[lockKey];
                return newLocks;
            });
        }, 5 * 60 * 1000); // 5 minutes

        setSelectedSlot(slot);
        onSlotSelect(slot);

        return () => clearTimeout(timer);
    };

    if (loading) return <div>Đang tải lịch khám...</div>;
    if (slots.length === 0) return <div>Không có lịch khám trống trong ngày này.</div>;

    return (
        <div className="time-slot-picker">
            <h3>Chọn khung giờ khám</h3>
            <div className="slot-grid">
                {slots.map((slot) => (
                    <button
                        key={slot.time}
                        className={`slot-btn ${selectedSlot?.time === slot.time ? 'selected' : ''} ${slot.isLocked ? 'locked' : ''}`}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={slot.isLocked}
                    >
                        {slot.time}
                        {slot.isLocked && <span className="lock-icon">🔒</span>}
                    </button>
                ))}
            </div>
        </div>
    );
};