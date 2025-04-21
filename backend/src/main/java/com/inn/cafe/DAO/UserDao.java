package com.inn.cafe.DAO;

import com.inn.cafe.POJO.User;
import com.inn.cafe.Wrapper.UserWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import javax.transaction.Transactional;
//import java.beans.Transient;
import java.util.List;


public interface UserDao extends JpaRepository<User, Integer> {
   User findByEmailId(@Param("email") String email);   // both "email" inside @Param and after String should be same
//    void save(User userFromMap);

   List<UserWrapper> getAllUser();

   List<String> getAllAdmin();  // to get the all admin to send mail to notify that the account(status) of user/admin has been updated with particular id

//   @Transient   // used when u want to exclude a field from being saved in db, like temporary data
   @Transactional  // @Transactional makes sure all database changes in a method are saved together; if one fails, everything is undone.
    @Modifying
   /** @Modifying in Spring Data JPA is used to annotate update or delete queries in a @Query method.
       It enables modifying operations like INSERT, UPDATE, or DELETE, as they do not return entity objects.
       It must be used with @Transactional for consistency.*/
   Integer updateStatus(@Param("status") String status, @Param("id") Integer id);


   User findByEmail(String email);
   /** to change the password we will extract the user by email, and then we will validate the token
   we don't need to write the implementation for the  findByEmail because JPA provide the implementation that whenever we write the 'findBy' with POJO name like
   findByEmail (here 'email' is POJO name) then it automatically generate the query for that table in the database this is done by JPA internally */



}


