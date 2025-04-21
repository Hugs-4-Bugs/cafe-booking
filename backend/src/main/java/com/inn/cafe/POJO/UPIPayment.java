package com.inn.cafe.POJO;

import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.persistence.*;

/**
 * Represents a UPI-based payment transaction.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("UPI") // Discriminator value for UPI payments
public class UPIPayment extends Payment {

    @Column(nullable = false, unique = true)
    private String upiId; // User's UPI ID (e.g., abc@okhdfc)

    private String qrCode; // QR Code URL for payment verification

    public UPIPayment() {
        super();
    }

    public UPIPayment(String userId, String provider, String transactionId, double amount, boolean status, String upiId, String qrCode) {
        super(userId, PaymentType.UPI, provider, transactionId, amount, status);
        this.upiId = upiId;
        this.qrCode = qrCode;
    }
}
