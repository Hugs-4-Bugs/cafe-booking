package com.inn.cafe.ServiceImpl;

import com.google.common.base.Strings;
import com.inn.cafe.Constents.CafeConstants;
import com.inn.cafe.DAO.UserDao;
import com.inn.cafe.JWT.CustomerUserDetailsService;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.JWT.JwtUtil;
import com.inn.cafe.POJO.User;
import com.inn.cafe.Service.UserService;
import com.inn.cafe.Utils.CafeUtils;
import com.inn.cafe.Utils.EmailUtils;
import com.inn.cafe.Wrapper.UserWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


@Slf4j
@Service
public class UserServiceImpl implements UserService {
    // creating object/bean of UserDao class using @Autowired
    @Autowired
    UserDao userDao;

    // creating object/bean of AuthenticationManager class using @Autowired
    @Autowired
    AuthenticationManager authenticationManager;

    // creating object/bean of CustomerUserDetailsService class using @Autowired
    @Autowired
    CustomerUserDetailsService customerUserDetailsService;

    // creating object/bean of JwtUtil class using @Autowired
    @Autowired
    JwtUtil jwtUtil;

    // creating object/bean of BCryptPasswordEncoder using @Autowired
//    @Autowired
//    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailUtils emailUtils;




    // implement the method [ see how to implement in UserRestImpl ]
    @Override
    public ResponseEntity<String> signUp(Map<String, String> requestMap) {
        log.info("Inside the signUp {}", requestMap);
        try {
            if (validateSignUpMap(requestMap)) {
                // now we have to check whether user's info (name, email etc.) is present in database or not so for that
                // we will create a query [named query] for email validation in UserDao class as: User findByEmailId(@Param("email") String email);

                User user = userDao.findByEmailId(requestMap.get("email"));  // we'll extract email id from requestMap
                if (Objects.isNull(user)) {
                    userDao.save(getUserFromMap(requestMap));  // in case user is not present
                    return CafeUtils.getResponseEntity("Registration Completed", HttpStatus.OK);

                } else {
                    return CafeUtils.getResponseEntity("Email Already Registered", HttpStatus.BAD_REQUEST);
                }

            } else {
                return CafeUtils.getResponseEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }

        } catch (Exception ex){
            // Used log.error to log the exception details during the sign-up process,
            // so that we can capture and debug the specific error when receiving a 500 status code.
//        log.error("Error during signUp: ", ex);
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.BAD_REQUEST);
//        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public boolean validateSignUpMap(Map<String, String> requestMap){
        if(requestMap.containsKey("name") && requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("email") && requestMap.containsKey("password")){
            return true;
        } else {
            return false;
        }
    }

// then create the user and save in the db, so we will create a separate class to extract the value from that Map and set it into the 'User' and return the User object
// method to return the user object in case user information is not present in the database

    // here the User belongs to POJO's[ie. Entity] User class
    private User getUserFromMap(Map<String, String> requestMap){
        User user = new User();

        // all the keys[ie. name, contactNumber, email, password] should be same as written in validateSignUpMap method
        user.setName(requestMap.get("name"));
        user.setContactNumber(requestMap.get("contactNumber"));
        user.setEmail(requestMap.get("email"));
        user.setPassword(passwordEncoder.encode(requestMap.get("password"))); // passwordEncoder.encode will hash the password using the BCryptPasswordEncoder before saving in the database
        user.setStatus("false");
        user.setRole("user");
        return user;
    }


    /**
     BCryptPasswordEncoder: When you use BCryptPasswordEncoder, the salting and hashing are handled internally.
     You do not need to manually generate a salt, as BCryptPasswordEncoder automatically generates a unique salt
     each time you call encode(). This is why using BCryptPasswordEncoder is generally recommended for secure password hashing.

     BCrypt (with password hashing): If you use BCrypt directly for password hashing (e.g., BCrypt.hashpw()),
     you would need to manually handle the salt by calling BCrypt.gensalt() first and then passing it to BCrypt.hashpw().

     EX:
     // Manually generate salt and hash the password
     String salt = BCrypt.gensalt();
     String hashedPassword = BCrypt.hashpw(requestMap.get("password"), salt);

     So, if you're using BCryptPasswordEncoder, you do not need to manually call gensalt().
     */




    // Method for login
    /**
     first we have extracted the email & password from requestMap [from this requestMap: public ResponseEntity<String> login(Map<String, String> requestMap) { ]
     and after that authentication is done.
     If  "[ if(auth.isAuthenticated()){ ]" is authenticated then the user role & status will be extracted from it or will be validated.
     And then "jwtUtil" method will be called to generate the token for the user as:
               "jwtUtil.generateToken(customerUserDetailsService.getUserDetail().getEmail()......."
     */
    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside login ");

        try{
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password")));

/**
 // // UNCOMMENT THIS 2 LINE OF CODE (by ChatGPT)
//            // userDetails holds the authenticated user information retrieved from the database using the email.
//            UserDetails userDetails = customerUserDetailsService.loadUserByUsername(requestMap.get("email"));
//
//            // user holds the full User entity, including additional details such as approval status, fetched from the database.
//            com.inn.cafe.POJO.User user = customerUserDetailsService.getUserDetail();
*/

            // If User is approved
            if(auth.isAuthenticated()){
// here if in case user is not "true" for now, then it means user is not approved by the admin. And we'll return the message "Wait for admin approval."
                if(customerUserDetailsService.getUserDetail().getStatus().equalsIgnoreCase("true")){
                    return new ResponseEntity<String>("{\"token\":\"" +
                            jwtUtil.generateToken(customerUserDetailsService.getUserDetail().getEmail(),
                                    customerUserDetailsService.getUserDetail().getRole()) + "\"}", HttpStatus.OK);  // here we have extracted the role and set into the token
                }
            // If User is not approved
                else {
                    return new ResponseEntity<String>("{\"message\":\"Wait for admin approval.\"}", HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception ex) {
            log.error("Login error: {}", ex.getMessage());
        }
        return new ResponseEntity<String>("{\"message\":\"Bad Credential.\"}", HttpStatus.BAD_REQUEST);

    }


// to get all the user by admin role
    @Override
    public ResponseEntity<List<UserWrapper>> getAllUser() {
        try {
            if (jwtFilter.isAdmin()) {
                return new ResponseEntity<>(userDao.getAllUser(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    // method to update the user details
    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {  // if user is admin
                // since the id is of String type so, we have used parseInt to convert a string representation of a number into an integer.
                Optional<User> optional = userDao.findById(Integer.parseInt(requestMap.get("id")));
                if (!optional.isEmpty()) {
                    userDao.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));

                    // to notify all the admin about the modification in user/admin account status for account enable/disable with particular id
                    sendMailToALlAdmin(requestMap.get("status"), optional.get().getEmail(), userDao.getAllAdmin());

                    return CafeUtils.getResponseEntity("User Status Updated Successfully", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("User id doesn't exists", HttpStatus.OK);
                }
            } else {  // if user is not admin
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHOROZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }




    private void sendMailToALlAdmin(String status, String user, List<String> allAdmin) {
//       the below line [allAdmin.remove(jwtFilter.getCurrentUser())] removes the admin who made the change from the notification list, so they don't receive the email.
        allAdmin.remove(jwtFilter.getCurrentUser());  // The admin who made the change is removed from the list so they don't receive the email.
        if (status != null && status.equalsIgnoreCase("true")) {
            emailUtils.sendSimpleMessage(jwtFilter.getCurrentUser(), "Account Approved", "USER:- " + user + "\n is approved by \nADMIN:- " + jwtFilter.getCurrentUser(), allAdmin);
        } else {
            emailUtils.sendSimpleMessage(jwtFilter.getCurrentUser(), "Account Disabled", "USER:- " + user + "\n is disabled by \nADMIN:- " + jwtFilter.getCurrentUser(), allAdmin);

        }
    }


// method to check the token for validation whether api is being accessed by user or admin. if you try to hit the api with invalid token then it will return 403(insufficient permission), if token is validated it will return 200 status code
    @Override
    public ResponseEntity<String> checkToken() {
        return CafeUtils.getResponseEntity("true", HttpStatus.OK);

    }

    @Override
    public ResponseEntity<String> changePassword(Map<String, String> requestMap) {
        try {
// Find the user by email (from token)
// to change the password first we have to find the user by email from the token(from token you will get the current user)
            User userObj = userDao.findByEmail(jwtFilter.getCurrentUser());
            if (!userObj.equals(null)) {    // Check if the user exists
                if (passwordEncoder.matches(requestMap.get("oldPassword"), userObj.getPassword())) {
                    // Hash the new password before saving it
                    userObj.setPassword(requestMap.get("newPassword"));
                    userDao.save(userObj);  // // Save the updated user object
                    return CafeUtils.getResponseEntity("Password Updated Successfully", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity("Incorrect Old Password", HttpStatus.BAD_REQUEST);
            }
            return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }



/**
// method for FORGET PASSWORD using @RequestParam  👇👇👇👇👇


    @Override
    public ResponseEntity<String> forgotPassword(String email) {
        try {
            // Find user by email
            User user = userDao.findByEmail(email);

            // If the email exists, send credentials to the user's email
            if (user != null) {
                emailUtils.forgotMail(user.getEmail(), "Credentials by Cafe Management System", user.getPassword());
                return CafeUtils.getResponseEntity("Check your mail for Credentials", HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity("Email not found", HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    */

// method for FORGET PASSWORD using @RequestBody 👇👇👇👇👇
    @Override
    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap) {
        try {
            /** with the help of email id we can get only the email id. we can't return the userId and Password to a particular user on the basis of email simply,
             and for that we will fetch the user data from database, and we will return the particular userId and Password to specific mail on which we have received
             through User user = userDao.findByEmail(requestMap.get("email")); */
            User user = userDao.findByEmail(requestMap.get("email"));   // on this mail user will receive the userId and Password

            // If the email exists in the database, send the password to the user's email.
            if (!Objects.isNull(user) && !Strings.isNullOrEmpty(user.getEmail()))
//                The below `forgotMail` method from `EmailUtils` sends the user's password to their email when they request a password reset.
                emailUtils.forgotMail(user.getEmail(), "Credentials by Cafe Management System", user.getPassword());
            return CafeUtils.getResponseEntity("Check your mail for Credentials", HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
































/**

// OR WE CAN IMPLEMENT THE LOGIC FOR LOGIN LIKE THIS ALSO

    public ResponseEntity<String> login(Map<String, String> requestmap) {
        log.info("Inside login");
        try {
            // Find the user by email
            User user = userDao.findByEmailId(requestmap.get("email"));

            // Check if user exists and password matches
            if (user != null && passwordEncoder.matches(requestmap.get("password"), user.getPassword())) {
                // Authenticate user using authentication manager
                Authentication auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(requestmap.get("email"), requestmap.get("password"))
                );

                if (auth.isAuthenticated()) {
                    if (user.getStatus().equalsIgnoreCase("true")) {

                        // Generate JWT token for authenticated user
                        return new ResponseEntity<>("{\"token\":\"" +
                                jwtUtil.generateToken(user.getEmail(), user.getRole()) +
                                "\"}", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("{\"message\":\"wait for admin approval.\"}", HttpStatus.BAD_REQUEST);
                    }
                }
            }
        } catch (Exception ex) {
            log.error("Login error: {}", ex.getMessage());
        }

        return new ResponseEntity<>("{\"message\":\"BAD Credentials.\"}", HttpStatus.BAD_REQUEST);
    }
}

*/








    /**
     // OR WE CAN IMPLEMENT THE LOGIC FOR LOGIN LIKE THIS ALSO


    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside login");
        try {
            // Log the incoming credentials
            log.info("Email: {}, Password: {}", requestMap.get("email"), requestMap.get("password"));

            // Authenticate user
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password"))
            );

            // Log the authentication status
            log.info("Authentication successful: {}", auth.isAuthenticated());

            if (auth.isAuthenticated()) {
                // Check if the user is approved
                if (customerUserDetailsService.getUserDetail().getStatus().equalsIgnoreCase("true")) {
                    String token = jwtUtil.generateToken(customerUserDetailsService.getUserDetail().getEmail(),
                            customerUserDetailsService.getUserDetail().getRole());
                    log.info("Generated token: {}", token);
                    return new ResponseEntity<String>("{\"token\":\"" + token + "\"}", HttpStatus.OK);
                } else {
                    log.warn("User not approved, waiting for admin approval");
                    return new ResponseEntity<String>("{\"message\":\"Wait for admin approval.\"}", HttpStatus.BAD_REQUEST);
                }
            } else {
                log.error("Authentication failed for email: {}", requestMap.get("email"));
            }
        } catch (Exception ex) {
            log.error("Error during login: {}", ex.getMessage());
        }
        return new ResponseEntity<String>("{\"message\":\"Bad Credentials\"}", HttpStatus.BAD_REQUEST);
    }
*/

