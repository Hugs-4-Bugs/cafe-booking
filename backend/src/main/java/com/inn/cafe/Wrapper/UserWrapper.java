package com.inn.cafe.Wrapper;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data     // this will add all the required dependency by automatically generated the getters, setters reducing the boilerplate code.
@NoArgsConstructor  // this is used for zero argument constructor
public class UserWrapper {
//    UserWrapper userWrapper = new com.inn.cafe.Wrapper.UserWrapper(1, "Prabhat Kumar", "prabhat72@example.com", "7250063206", "false");
//                                              (Integer id, String name,      String email,    String contact_number, String status)
    private  Integer id;

    private String name;

    private String email;

    private String contactNumber;

    private String status;


    // constructor
    public UserWrapper(Integer id, String name, String email, String contactNumber, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.status = status;
    }
}
