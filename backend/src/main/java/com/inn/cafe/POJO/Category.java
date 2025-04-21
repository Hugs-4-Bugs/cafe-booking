package com.inn.cafe.POJO;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;


/** here we are extracting all the category id which exists in Product 'p' where status is true. */
//@NamedQuery(name = "Category.getAllCategory", query = "select c from Category c")
@NamedQuery(name = "Category.getAllCategory", query = "select c from Category c where c.id IN (SELECT p.category.id FROM Product p WHERE p.status='true')")


@Data   // it will provide default zero argument constructor for our class, getters & setters for all the variables
@Entity  // Marks the class as a JPA entity, meaning it maps to a database table.
@DynamicInsert  // Excludes null fields from INSERT statements to use database default values.
@DynamicUpdate  // Updates only modified fields in UPDATE statements to improve performance.
@Table(name = "category")
public class Category implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Version  // optimistic locking machanism
    @Column(name = "version")
    private Integer version;


    // implementation to add the product in category from Excel file
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;

}
