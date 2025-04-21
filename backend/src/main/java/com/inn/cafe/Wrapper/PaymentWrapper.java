package com.inn.cafe.Wrapper;

import com.inn.cafe.POJO.Payment;
import com.inn.cafe.POJO.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Wrapper class for structured payment response.
 this is DTO for payment class
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWrapper {

    private Long id;                  // Payment ID
    private String userId;             // User who made the payment
    private PaymentType paymentType;   // Enum: CARD, UPI, WALLET
    private String provider;           // Provider (Visa, Paytm, PhonePe, etc.)
    private String transactionId;      // Transaction reference
    private double amount;             // Payment amount
    private boolean status;            // Payment success/failure
    private LocalDateTime timestamp;   // Timestamp of the payment

    /**
     * Converts a Payment entity to a PaymentWrapper DTO.
     */
    public static PaymentWrapper fromEntity(Payment payment) {
        return new PaymentWrapper(
                payment.getId(),
                payment.getUserId(),
                payment.getPaymentType(),
                payment.getProvider(),
                payment.getTransactionId(),
                payment.getAmount(),
                payment.isStatus(),
                payment.getTimestamp()
        );
    }
}



/**
 * PaymentWrapper ek DTO (Data Transfer Object) hai jo Payment entity ka structured response dene ke liye use hota hai.
 *
 *
 * Kyun use kiya?
 * - Agar hum direct Payment entity bhejte, to usme extra unwanted details bhi hoti.
 * - Isliye hum sirf necessary fields ko filter karne ke liye ek Wrapper class use kar rahe hain.
 * - Ye ensure karta hai ki API ka response clean aur readable rahe.
 *
 *
 * Simple words me:
 * PaymentWrapper ek filter ki tarah kaam karta hai jo sirf required data ko API tak pahunchata hai. 🚀
 */
