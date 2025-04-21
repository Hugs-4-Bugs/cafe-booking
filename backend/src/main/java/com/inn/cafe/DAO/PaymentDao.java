package com.inn.cafe.DAO;

import com.inn.cafe.POJO.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO (Data Access Object) for Payment entity.
 * This interface allows database operations for Payment records.
 */
public interface PaymentDao extends JpaRepository<Payment, Long> {
    // JpaRepository provides built-in CRUD methods (save, findById, findAll, delete, etc.)
}
