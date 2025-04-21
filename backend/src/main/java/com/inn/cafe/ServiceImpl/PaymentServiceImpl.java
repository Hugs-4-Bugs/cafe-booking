package com.inn.cafe.ServiceImpl;

import com.inn.cafe.DAO.PaymentDao;
import com.inn.cafe.POJO.CardPayment;
import com.inn.cafe.POJO.Payment;
import com.inn.cafe.POJO.UPIPayment;
import com.inn.cafe.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for handling payment operations.
 * This class interacts with PaymentDao to perform database operations.
 */
@Service // Marks this class as a service component in Spring
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentDao paymentDao; // Injecting PaymentDao to interact with the database

    /**
     * Processes a payment and saves it to the database.
     * @param payment Payment object containing transaction details.
     * @return The saved Payment object.
     */
    @Override
    public Payment processPayment(Payment payment) {
        if (payment instanceof UPIPayment) {
            return paymentDao.save((UPIPayment) payment); // Explicitly saving UPIPayment
        } else if (payment instanceof CardPayment) {
            return paymentDao.save((CardPayment) payment);
        }
        return paymentDao.save(payment); // Default case

    }

    /**
     * Retrieves all payments from the database.
     * @return A list of all stored payments.
     */
    @Override
    public List<Payment> getAllPayments() {
        return paymentDao.findAll(); // Fetches all payment records
    }

    /**
     * Fetches a payment by its unique ID.
     * @param paymentId The unique identifier of the payment.
     * @return The Payment object if found, otherwise null.
     */
    @Override
    public Payment getPaymentById(Long paymentId) {
        Optional<Payment> payment = paymentDao.findById(paymentId); // Fetches payment by ID
        return payment.orElse(null); // Returns the payment if found, otherwise null
    }

    /**
     * Verifies if a given UPI ID is valid.
     * This is a basic check and should be replaced with an actual UPI verification API.
     * @param upiId The UPI ID to be verified.
     * @return true if the UPI ID is valid, false otherwise.
     */
    @Override
    public boolean verifyUpi(String upiId) {
        return upiId.endsWith("@upi") || upiId.endsWith("@ybl"); // Dummy validation for UPI ID
    }

    /**
     * Generates a QR code for UPI payments.
     * Uses an external API to generate a QR code containing UPI ID and amount.
     * @param upiId The UPI ID of the recipient.
     * @param amount The transaction amount.
     * @return A URL containing the generated QR code.
     */
    @Override
    public String generateQrCode(String upiId, double amount) {
        return "https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=" + upiId + "&am=" + amount;
    }


    /**
     * Processes wallet-based payments by generating a redirection URL.
     * This URL can be used to redirect users to their respective wallet apps.
     * @param walletType The type of wallet (PhonePe, Paytm, Google Pay, etc.).
     * @param amount The payment amount.
     * @return A URL to redirect the user to the respective wallet app.
     */
    @Override
    public String processWalletPayment(String walletType, double amount) {
        String baseUrl = "";

        switch (walletType.toLowerCase()) {
            case "phonepe":
                baseUrl = "https://www.phonepe.com/pay?amount=" + amount;
                break;
            case "paytm":
                baseUrl = "https://paytm.com/pay?amount=" + amount;
                break;
            case "googlepay":
                baseUrl = "https://gpay.app.goo.gl/?amount=" + amount;
                break;
            default:
                baseUrl = "https://www.wallet.com/pay?amount=" + amount; // Default case
                break;
        }
        return baseUrl;
    }
}
