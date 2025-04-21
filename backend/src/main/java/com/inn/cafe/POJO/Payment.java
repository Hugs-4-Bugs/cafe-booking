package com.inn.cafe.POJO;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a payment entity storing transaction details.
 */
@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique ID for each payment transaction

    @Column(nullable = false)
    private String userId; // User who made the payment

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType; // Enum (CARD, UPI, WALLET)

    private String provider; // e.g., "VISA", "PhonePe", "Google Pay"

    private String transactionId; // Unique transaction reference

    private double amount; // Payment amount

    private boolean status; // Payment success/failure

    private LocalDateTime timestamp; // When the payment was made

    private String upiId;      // ✅ Added UPI ID for UPI payments
    private String walletType; // ✅ Added Wallet Type (Paytm, PhonePe, etc.)

    /**
     * Default constructor required by JPA
     */
    public Payment() {}

    /**
     * Constructor to initialize a new payment
     */
    public Payment(String userId, PaymentType paymentType, String provider, String transactionId, double amount, boolean status, String upiId, String walletType) {
        this.userId = userId;
        this.paymentType = paymentType;
        this.provider = provider;
        this.transactionId = transactionId;
        this.amount = amount;
        this.status = status;
        this.timestamp = LocalDateTime.now();
        this.upiId = upiId;
        this.walletType = walletType;
    }

    public Payment(String userId, PaymentType paymentType, String provider, String transactionId, double amount, boolean status) {
    }
}




/**
 * Payment ek Parent class hai jo different payment methods (Card, UPI, Wallet) ko represent karti hai.
 *
 * Kyun Factory Pattern nahi, balki Singleton jaisa behave kar raha hai?
 * - Humne alag-alag payment methods ko implement karke unhe Payment class me seal kar diya hai.
 * - Factory pattern me har method ka alag object banta hai, lekin yahan sirf 1 object ka reference use ho raha hai.
 * - Is wajah se ye Singleton pattern jaisa behave kar raha hai, kyunki ek hi instance se saari payments handle ho rahi hain.
 *
 *
 * Simple words me:
 * Payment class ek container ki tarah kaam kar rahi hai jo **ek hi object ka reference** use karke multiple payment methods ko support karti hai. ✅
 */


/*
In simple word:

humne separate payment method ko implement karke usko Parent payment class 'Payment' me seal kar
diye hai to ye factory Design pattern k jaisa behave na karke singleton design pattern behave kar
raha kyuki, all 3 payment methods ka only 1 object banakar refer kar raha hai tino payment methods ko
*/