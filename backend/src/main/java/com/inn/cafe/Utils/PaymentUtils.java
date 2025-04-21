package com.inn.cafe.Utils;

import java.util.UUID;

/**
 * Utility class for payment-related operations.
 */
public class PaymentUtils {

    /**
     * Generates a unique transaction ID.
     * @return Random UUID as a string.
     */
    public static String generateTransactionId() {
        return UUID.randomUUID().toString();
    }

    /**
     * Validates a UPI ID format.
     * @param upiId The UPI ID to validate.
     * @return true if valid, false otherwise.
     */
    public static boolean validateUpiId(String upiId) {
        return upiId != null && upiId.matches("^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$");
    }

    /**
     * Validates card number format (Basic Luhn Algorithm check can be added).
     * @param cardNumber The card number as a string.
     * @return true if valid, false otherwise.
     */
    public static boolean validateCardNumber(String cardNumber) {
        return cardNumber != null && cardNumber.matches("^[0-9]{16}$");
    }
}





/**
 * The purpose of creating a separate `PaymentUtils` class is to centralize all payment-related helper methods in one place.
 * By doing this, we make it easier to:
 * 1. Reuse payment validation and transaction generation methods across the application.
 * 2. Keep the code cleaner by not repeating the same payment-related logic in multiple parts of the application.
 * 3. Update or fix payment logic in one place, making the code more maintainable and less error-prone.
 */
