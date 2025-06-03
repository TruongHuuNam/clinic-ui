// pages/PaymentPage.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment, patientInfo } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [showQRModal, setShowQRModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    if (!appointment || !patientInfo) {
        navigate('/');
        return null;
    }

    const handlePayment = () => {
        // Simulate payment processing
        setTimeout(() => {
            setPaymentSuccess(true);
            setShowQRModal(true);

            // In a real app, you would send confirmation email here
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <div className="payment-success">
                <h2>Đặt lịch thành công!</h2>
                <p>Thông tin lịch hẹn đã được gửi đến email của bạn.</p>

                <div className="appointment-summary">
                    <h3>Thông tin lịch hẹn</h3>
                    <p><strong>Bác sĩ:</strong> {appointment.doctor.name}</p>
                    <p><strong>Chuyên khoa:</strong> {appointment.doctor.specialty}</p>
                    <p><strong>Thời gian:</strong> {appointment.date} - {appointment.time}</p>
                    <p><strong>Địa điểm:</strong> {appointment.clinic.name}</p>
                    <p><strong>Địa chỉ:</strong> {appointment.clinic.address}</p>
                </div>

                <button onClick={() => setShowQRModal(true)}>Xem mã QR</button>
                <button onClick={() => navigate('/user/appointments')}>Xem lịch hẹn của tôi</button>

                {showQRModal && (
                    <div className="qr-modal">
                        <div className="qr-content">
                            <h3>Mã QR lịch hẹn</h3>
                            <QRCode value={`appointment:${appointment.id}`} />
                            <p>Vui lòng trình mã này khi đến phòng khám</p>
                            <button onClick={() => setShowQRModal(false)}>Đóng</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="payment-page">
            <h2>Thanh toán</h2>

            <div className="payment-summary">
                <h3>Thông tin lịch hẹn</h3>
                <p><strong>Bệnh nhân:</strong> {patientInfo.fullName}</p>
                <p><strong>Bác sĩ:</strong> {appointment.doctor.name}</p>
                <p><strong>Thời gian:</strong> {appointment.date} - {appointment.time}</p>
                <p><strong>Phí khám:</strong> {appointment.fee.toLocaleString()} VND</p>
            </div>

            <div className="payment-methods">
                <h3>Phương thức thanh toán</h3>
                <div className="method-options">
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="vnpay"
                            checked={paymentMethod === 'vnpay'}
                            onChange={() => setPaymentMethod('vnpay')}
                        />
                        <div className="method-card">
                            <img src="/vnpay-logo.png" alt="VNPAY" />
                            <span>Thanh toán qua VNPAY</span>
                        </div>
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                        />
                        <div className="method-card">
                            <i className="fas fa-money-bill-wave"></i>
                            <span>Thanh toán tiền mặt tại phòng khám</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="payment-actions">
                <button onClick={() => navigate(-1)}>Quay lại</button>
                <button className="btn-pay" onClick={handlePayment}>
                    {paymentMethod === 'vnpay' ? 'Thanh toán qua VNPAY' : 'Xác nhận đặt lịch'}
                </button>
            </div>
        </div>
    );
};