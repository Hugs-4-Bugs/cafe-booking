package com.inn.cafe.Rest;


import com.inn.cafe.POJO.Bill;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/bill")
public interface BillRest {


    @PostMapping(path = "/generateReport")
    ResponseEntity<String> generateReport(@RequestBody Map<String, Object> requestMap);
    /**
     * We use `Object` as the value type in `Map<String, Object>` because the request body
     * can contain different data types (String, Integer, JSON objects, etc.).

     * For example, the request body may include:
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "total": 500,
     *   "productDetails": [{"id": 1, "name": "Pizza", "price": 200}, {"id": 2, "name": "Pasta", "price": 300}]
     * }

     * Since `productDetails` is a JSON array (which can be a List or another Map), using `Object` allows
     * us to handle different data types flexibly.
     */


    // API to get the Bills based on the particular Admin [for ex. admin X will get the list of bill which he has generated only followed by latest bill on top]
    @GetMapping(path = "/getBills")
    ResponseEntity<List<Bill>> getBills();



    // API to download the pdf of bill in case of user has lost it and if needed in future for business purpose
    @GetMapping(path = "/getPdf")
    ResponseEntity<byte[]> getPdf(@RequestBody Map<String, Object> requestMap);


    // API to delete the bill
    @PostMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteBill(@PathVariable Integer id);
}
