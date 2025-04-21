package com.inn.cafe.POJO;


//import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;


// here 2nd 'u' is alias for 1st 'u' and if u change 'User' to 'user' in [query = "select u from User u where u.email=: email"] then it will give an error as 'user' is not mapped
// here findByEmailId should be same as written in DAO's UserDao class and email, name, role etc. should be same as written in entity class
@NamedQuery(name = "User.findByEmailId", query = "select u from User u where u.email=:email")    // now with this query the user data will be accessed through email and, we can do same for name/id etc. also depends upon requirement
@NamedQuery(name = "User.getAllUser", query = "select new com.inn.cafe.Wrapper.UserWrapper(u.id,u.name,u.contactNumber,u.email,u.status) from User u where u.role = 'user'")
@NamedQuery(name = "User.updateStatus", query = "update User u set u.status=:status where u.id=:id")
@NamedQuery(name = "User.getAllAdmin", query = "select u.email from User u where u.role = 'admin'")

@Data   // it will provide default zero argument constructor for our class, getters & setters for all the variables
@Entity  // Marks the class as a JPA entity, meaning it maps to a database table.
@DynamicInsert  // Excludes null fields from INSERT statements to use database default values.
@DynamicUpdate  // Updates only modified fields in UPDATE statements to improve performance.
@Table(name = "user")
public class User implements Serializable {  // User in this line is mapped with "user" present in @Table(name = "user") so in query we will write "User" not "user"
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "contactNumber")
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "status")
    private String status;

    @Column(name = "role")
    private String role;






    /**
      Since we have used the @Data which is lombok annotation to reduce the boilerplate code
      So we don't need to create the getter setter and constructors
      if you will not use the @Data annotation then we have do use the getter setter and
      constructor of all the variables we have initialized as:


      CONSTRUCTOR:

         public User(){
         }
         public User(Integer id, String name, String contactNumber, String email, String password, String status, String role) {
           this.id = id;
           this.name = name;
           this.contactNumber = contactNumber;
           this.email = email;
           this.password = password;
           this.status = status;
           this.role = role;
       }





      GETTER & SETTER


          public Integer getId() {
           return id;
       }

       public void setId(Integer id) {
           this.id = id;
       }

       public String getName() {
           return name;
       }

       public void setName(String name) {
           this.name = name;
       }

       public String getContactNumber() {
           return contactNumber;
       }

       public void setContactNumber(String contactNumber) {
           this.contactNumber = contactNumber;
       }

       public String getEmail() {
           return email;
       }

       public void setEmail(String email) {
           this.email = email;
       }

       public String getPassword() {
           return password;
       }

       public void setPassword(String password) {
           this.password = password;
       }

       public String getStatus() {
           return status;
       }

       public void setStatus(String status) {
           this.status = status;
       }

       public String getRole() {
           return role;
       }

       public void setRole(String role) {
           this.role = role;
       }

    */

}
