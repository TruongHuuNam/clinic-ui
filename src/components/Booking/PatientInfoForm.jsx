// components/Booking/PatientInfoForm.jsx
import { useState } from 'react';

const PatientInfoForm = ({ doctor, selectedSlot, onNext }) => {
    const [patientInfo, setPatientInfo] = useState({
        fullName: '',
        phone: '',
        email: '',
        gender: 'male',
        dob: '',
        reason: '',
        isForSelf: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPatientInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(patientInfo);
    };

    return (
        <div className="booking-form">
            <h2>Thông tin đặt lịch</h2>

            <div className="booking-summary">
                <h3>Bác sĩ: {doctor.name}</h3>
                <p>Chuyên khoa: {doctor.specialty}</p>
                <p>Thời gian: {selectedSlot.date} - {selectedSlot.time}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Bạn đang đặt lịch cho:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="isForSelf"
                                checked={patientInfo.isForSelf}
                                onChange={handleChange}
                            /> Bản thân
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="isForSelf"
                                checked={!patientInfo.isForSelf}
                                onChange={handleChange}
                            /> Người khác
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                        type="text"
                        name="fullName"
                        value={patientInfo.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={patientInfo.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={patientInfo.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Giới tính</label>
                        <select
                            name="gender"
                            value={patientInfo.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            name="dob"
                            value={patientInfo.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Lý do khám/Triệu chứng</label>
                    <textarea
                        name="reason"
                        value={patientInfo.reason}
                        onChange={handleChange}
                        placeholder="Mô tả triệu chứng hoặc lý do khám..."
                    />
                </div>

                <button type="submit" className="btn-next">Tiếp tục</button>
            </form>
        </div>
    );
};