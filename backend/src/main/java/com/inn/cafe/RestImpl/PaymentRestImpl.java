package com.inn.cafe.RestImpl;

import com.inn.cafe.POJO.Payment;
import com.inn.cafe.POJO.UPIPayment;
import com.inn.cafe.Rest.PaymentRest;
import com.inn.cafe.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Implementation of PaymentRest interface.
 * Handles business logic and interacts with PaymentService.
 */
@RestController
@RequestMapping("/api/payment") // Base path for all payment-related APIs
@CrossOrigin(origins = "*") // Allow requests from any frontend
public class PaymentRestImpl implements PaymentRest {

    @Autowired
    private PaymentService paymentService; // Injecting PaymentService for business logic

    /**
     * Processes any type of payment and saves it in the database.
     */
    @Override
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        Payment savedPayment = paymentService.processPayment(payment);
        return ResponseEntity.ok(savedPayment);
    }

    /**
     * Retrieves all stored payments from the database.
     */
    @Override
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    /**
     * Retrieves a payment record using Payment ID.
     */
    @Override
    public ResponseEntity<Payment> getPaymentById(@PathVariable("id") Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        return (payment != null) ? ResponseEntity.ok(payment) : ResponseEntity.notFound().build();
    }


    /**
     * Verifies if a given UPI ID exists in the database.
     */
    @Override
    public ResponseEntity<String> verifyUpi(@RequestBody String upiId) {
        boolean isValid = paymentService.verifyUpi(upiId);
        return isValid ? ResponseEntity.ok("✅ UPI ID is valid") : ResponseEntity.badRequest().body("❌ Invalid UPI ID");
    }

    /**
     * Processes a UPI payment and stores the transaction details in DB.
     */
    @Override
    public ResponseEntity<String> processUpiPayment(@RequestBody UPIPayment payment) {
        UPIPayment savedPayment = (UPIPayment) paymentService.processPayment(payment);
        return ResponseEntity.ok("✅ UPI Payment stored successfully! Transaction ID: " + savedPayment.getTransactionId());
    }

    /**
     * Generates a QR Code for UPI payment and returns the QR Code URL.
     */
    @Override
    public ResponseEntity<String> processQrUpiPayment(@RequestBody Payment payment) {
        String qrCodeUrl = paymentService.generateQrCode(payment.getUpiId(), payment.getAmount());
        return ResponseEntity.ok(qrCodeUrl);
    }

    /**
     * Processes a wallet payment and provides redirection URL for payment gateway.
     */
    @Override
    public ResponseEntity<String> processWalletPayment(@RequestBody Payment payment) {
        String redirectionUrl = paymentService.processWalletPayment(payment.getWalletType(), payment.getAmount());
        return ResponseEntity.ok(redirectionUrl);
    }


    @Override
    public ResponseEntity<String> generateQrCode(@PathVariable String upiId, @PathVariable double amount) {
        String qrCodeUrl = paymentService.generateQrCode(upiId, amount);
        return ResponseEntity.ok(qrCodeUrl);
    }
}
