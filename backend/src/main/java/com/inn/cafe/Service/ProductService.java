package com.inn.cafe.Service;

import com.inn.cafe.POJO.Product;
import com.inn.cafe.Wrapper.ProductWrapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ProductService {

    // to add the new product in to the list
    ResponseEntity<String> addNewProduct(Map<String, String> requestMap);


    ResponseEntity<List<ProductWrapper>> getAllProduct();

    ResponseEntity<String> updateProduct(Map<String, String> requestMap);

    ResponseEntity<String> deleteProduct(Integer id);

    ResponseEntity<String> updateStatus(Map<String, String> requestMap);

    ResponseEntity<List<ProductWrapper>> getByCategory(Integer id);

    ResponseEntity<ProductWrapper> getProductById(Integer id);

    ResponseEntity<String> processExcelData(MultipartFile file);

    Page<Product> getAllProductList(Pageable pageable);
}
