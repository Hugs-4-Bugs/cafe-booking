package com.inn.cafe.Service;

import com.inn.cafe.POJO.Category;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.List;

public interface CategoryService {

    ResponseEntity<String> addNewCategory(Map<String, String> requestMap);

    /** API to get all the items by admin only if you use the url: http://localhost:8000/category/get?filterValue=true
     * and if u use http://localhost:8000/category/get it will list all the items by normal user
     */
    ResponseEntity<List<Category>> getAllCategory(String filterValue);

    ResponseEntity<String> updateCategory(Map<String, String> requestMap);

}
