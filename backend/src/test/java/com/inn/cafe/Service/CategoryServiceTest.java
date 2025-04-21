package com.inn.cafe.Service;

import com.inn.cafe.DAO.CategoryDao;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Category;
import com.inn.cafe.ServiceImpl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Mock
    private CategoryDao categoryDao;

    @Mock
    private JwtFilter jwtFilter;

    private Map<String, String> requestMap;
    private Category category;

    @BeforeEach
    void setUp() {
        requestMap = new HashMap<>();
        requestMap.put("name", "Beverages");

        category = new Category();
        category.setId(1);
        category.setName("Beverages");
    }

    @Test
    void testAddNewCategory_Success() {
        when(jwtFilter.isAdmin()).thenReturn(true);
        when(categoryDao.save(Mockito.any(Category.class))).thenReturn(category);

        ResponseEntity<String> response = categoryService.addNewCategory(requestMap);

        assertEquals(HttpStatus.OK.value(), response.getStatusCodeValue());
        assertEquals("Category Added Successfully", response.getBody());
    }

    @Test
    void testAddNewCategory_Unauthorized() {
        when(jwtFilter.isAdmin()).thenReturn(false);

        ResponseEntity<String> response = categoryService.addNewCategory(requestMap);

        // Fix message assertion
        assertEquals(HttpStatus.FORBIDDEN.value(), response.getStatusCodeValue());
        assertEquals("{\"message\":\"Unauthorized access\"}", response.getBody());
    }

    @Test
    void testGetAllCategories() {
        List<Category> categoryList = Collections.singletonList(category);
        when(categoryDao.findAll()).thenReturn(categoryList);

        ResponseEntity<List<Category>> response = categoryService.getAllCategory("true");

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());
        assertEquals(1, response.getBody().size());  // Ensure a category is returned
        assertEquals("Beverages", response.getBody().get(0).getName());
    }

    @Test
    void testUpdateCategory_Success() {
        when(jwtFilter.isAdmin()).thenReturn(true);
        when(categoryDao.findById(1)).thenReturn(Optional.of(category));

        // Fix requestMap by adding id
        requestMap.put("id", "1");
        requestMap.put("name", "Updated Beverages");

        ResponseEntity<String> response = categoryService.updateCategory(requestMap);

        assertEquals(HttpStatus.OK.value(), response.getStatusCodeValue());
        assertEquals("Category Updated Successfully", response.getBody());
    }

    @Test
    void testUpdateCategory_NotFound() {
        when(jwtFilter.isAdmin()).thenReturn(true);
        when(categoryDao.findById(1)).thenReturn(Optional.empty()); // Only stub what's needed

        requestMap.put("id", "1");

        ResponseEntity<String> response = categoryService.updateCategory(requestMap);

        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getStatusCodeValue());
        assertEquals("Category id doesn't exist", response.getBody());
    }

    @Test
    void testUpdateCategory_Unauthorized() {
        when(jwtFilter.isAdmin()).thenReturn(false);

        ResponseEntity<String> response = categoryService.updateCategory(requestMap);

        // Fix message assertion
        assertEquals(HttpStatus.FORBIDDEN.value(), response.getStatusCodeValue());
        assertEquals("{\"message\":\"Unauthorized access\"}", response.getBody());
    }
}