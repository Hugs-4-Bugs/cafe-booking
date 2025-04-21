package com.inn.cafe.Service;

import com.inn.cafe.CafeManagementSystemApplication;
import com.inn.cafe.POJO.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = CafeManagementSystemApplication.class)
@Transactional
public class CategoryServiceIT {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryServiceTest categoryServiceTest;

    @Test
    void testGetAllCategories() {
        String filterValue = "false";
        List<Category> categories = (List<Category>) categoryService.getAllCategory(filterValue);
        assertNotNull(categories);
    }
}