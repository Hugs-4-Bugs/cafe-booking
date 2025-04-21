package com.inn.cafe.DAO;

import com.inn.cafe.POJO.Product;
import com.inn.cafe.Wrapper.ProductWrapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface ProductDao extends JpaRepository<Product, Integer> {

    List<ProductWrapper> getAllProduct();

//  //    🔹 Option 1: Change return type to void

    @Modifying
    @Transactional
    Integer updateProductStatus(@Param("status") String status, @Param("id") Integer id);



//    //    🔹 Option 2: Change return type to void

//    @Modifying
//    @Transactional
//    void updateProductStatus(@Param("status") String status, @Param("id") Integer id);
//


   // 🔹 Option 3: Use @Query with @Modifying
    /**
    if you use the Option 3 then remove the below line from Product POJO class:
    @NamedQuery(name = "Product.updateProductStatus", query = "update Product p set p.status = :status where p.id = :id")

     if you want to use the above query in the Product POJO class then don't use the Option 3
     */
//    @Modifying
//    @Transactional
//    @Query("UPDATE Product p SET p.status = :status WHERE p.id = :id")
//    int updateProductStatus(@Param("status") String status, @Param("id") Integer id);


    List<ProductWrapper> getProductByCategory(@Param("id") Integer id);

    ProductWrapper getProductById(@Param("id") Integer id);


    // Get the latest product ID from the database and increment it for the new entry
    Product findTopByOrderByIdDesc();  // Fetch the last inserted product


    Product findByNameAndCategory_Id(String name, Integer id);


    // Pagination implementaion
    Page<Product> findAll(Pageable pageable);
}
