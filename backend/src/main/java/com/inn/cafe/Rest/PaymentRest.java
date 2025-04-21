package com.inn.cafe.Rest;

import com.inn.cafe.POJO.Payment;
import com.inn.cafe.POJO.UPIPayment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Interface for Payment REST API.
 * Defines the endpoints for payment processing and retrieval.
 */
@RequestMapping("/api/payment") // Base path for all payment-related endpoints
public interface PaymentRest {

    /**
     * Process any type of payment (Card, UPI, Wallet).
     */
    @PostMapping("/process")
    ResponseEntity<Payment> processPayment(@RequestBody Payment payment);

    /**
     * Verify if a UPI ID is valid before proceeding with payment.
     */
    @PostMapping("/upi/verify")
    ResponseEntity<String> verifyUpi(@RequestBody String upiId);

    /**
     * Process a new UPI payment and store transaction in DB.
     */
    @PostMapping("/upi/pay")
    ResponseEntity<String> processUpiPayment(@RequestBody UPIPayment payment);

    /**
     * Process a UPI payment using QR Code.
     */
    @PostMapping("/upi/qr-pay")
    ResponseEntity<String> processQrUpiPayment(@RequestBody Payment payment);

    /**
     * Process a wallet payment (Paytm, PhonePe, Mobikwik).
     */
    @PostMapping("/wallet/pay")
    ResponseEntity<String> processWalletPayment(@RequestBody Payment payment);

    /**
     * Retrieve all payment records from the database.
     */
    @GetMapping("/all")
    ResponseEntity<List<Payment>> getAllPayments();

    /**
     * Retrieve details of a specific payment using Payment ID.
     */
    @GetMapping("/{id}")
    ResponseEntity<Payment> getPaymentById(@PathVariable("id") Long paymentId);


    @GetMapping("/generate-qr/{upiId}/{amount}")
    ResponseEntity<String> generateQrCode(@PathVariable String upiId, @PathVariable double amount);

}
