package com.inn.cafe.POJO;

import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.persistence.*;

/**
 * Represents a digital wallet payment transaction.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("WALLET") // Discriminator value for Wallet payments
public class WalletPayment extends Payment {

    private String walletName; // Wallet provider (e.g., Paytm, PhonePe)
    private String walletTransactionId; // Unique ID for the wallet transaction
}
