package com.inn.cafe.POJO;

import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.persistence.*;

/**
 * Represents a payment made using a credit/debit card.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("CARD") // Discriminator value for Card payments
public class CardPayment extends Payment {

    @Column(nullable = false)
    private String cardNumber; // Last 4 digits of the card (store only masked version)

    @Column(nullable = false)
    private String cardHolderName;

    @Column(nullable = false)
    private String cardExpiry;

    @Transient // Do not store CVV in the database for security reasons
    private String cvv;
}