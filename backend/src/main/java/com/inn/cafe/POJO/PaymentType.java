package com.inn.cafe.POJO;

/**
 * Enum representing different payment methods.
 */
public enum PaymentType {
    CARD,   // Credit/Debit Card payments (Visa, MasterCard, etc.)
    UPI,    // UPI Payments (Google Pay, PhonePe, Paytm, etc.)
    WALLET  // Digital Wallets (Amazon Pay, Mobikwik, etc.)
}



/**
 * Why use an Enum for PaymentType?
 * --------------------------------
 * - Ensures Type Safety: Prevents invalid payment types by restricting values to predefined constants.
 * - Improves Code Readability: Using `PaymentType.CARD` is more intuitive than using plain strings like `"Card"`.
 * - Reduces Errors: Eliminates typos and case sensitivity issues (`"Upi"` vs `"UPI"`).
 * - Memory Efficient: Enums are singleton instances, meaning only one copy exists in memory.
 * - Easy Expansion: New payment types can be added easily without modifying other parts of the code.
 *
 * What is an Enum?
 * ----------------
 * An `enum` (short for "enumeration") is a special Java class used to define a **fixed set of constants**.
 * In this case, `PaymentType` restricts payment methods to **CARD, UPI, and WALLET**, ensuring that no other invalid values are used.
 * This improves code safety, maintainability, and avoids unnecessary runtime errors.
 */
