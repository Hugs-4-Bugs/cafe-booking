package com.inn.cafe.Service;

import com.inn.cafe.DAO.CategoryDao;
import com.inn.cafe.DAO.ProductDao;
import com.inn.cafe.POJO.Category;
import com.inn.cafe.POJO.Product;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ExcelService {

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private ProductDao productDao;

    private static final Map<String, Integer> columnIndexMap = new HashMap<>();

    public List<Product> parseExcelFile(MultipartFile file) throws Exception {
        List<Product> products = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            if (sheet.getPhysicalNumberOfRows() < 2) {
                throw new Exception("Excel file is empty or has no valid data.");
            }

            // 🔥 Read header row & map column names
            Row headerRow = sheet.getRow(0);
            mapColumnIndexes(headerRow);

            for (Row row : sheet) {
                if (row.getRowNum() == 0 || isRowEmpty(row)) continue; // Skip header & empty rows

                Product product = new Product();

                // ✅ Read Data Dynamically
                String name = getCellValue(row, "name");
                if (name.isEmpty()) {
                    System.err.println("⚠️ Skipping row " + row.getRowNum() + ": Product name is missing.");
                    continue; // Skip if name is missing
                }
                product.setName(name);

                String description = getCellValue(row, "description");
                if (description.isEmpty()) {
                    System.err.println("⚠️ Skipping row " + row.getRowNum() + ": Product description is missing.");
                    continue; // Skip if description is missing
                }
                product.setDescription(description);

                Integer price = getIntCellValue(row, "price");
                if (price == null) {
                    System.err.println("⚠️ Skipping row " + row.getRowNum() + ": Invalid price format.");
                    continue;
                }
                product.setPrice(price);

                product.setStatus(getStatusCellValue(row, "status"));

                String categoryName = getCellValue(row, "category_name"); // Category name instead of ID
                if (categoryName.isEmpty()) {
                    System.err.println("⚠️ Skipping row " + row.getRowNum() + ": Category name is missing.");
                    continue; // Skip if category name is missing
                }

                Category category = categoryDao.findByName(categoryName).orElse(null);
                if (category != null) {
                    // Check if product already exists in the same category by name
                    Product existingProduct = productDao.findByNameAndCategory_Id(product.getName(), category.getId());
                    if (existingProduct != null) {
                        System.err.println("⚠️ Product with name '" + product.getName() + "' already exists in category " + category.getName() + ". Skipping this row.");
                        continue; // Skip if product already exists
                    }
                    product.setCategory(category);
                    products.add(product);
                } else {
                    System.err.println("⚠️ Category " + categoryName + " not found in DB. Skipping row.");
                }
            }

        } catch (IOException e) {
            throw new Exception("Error processing the Excel file: " + e.getMessage(), e);
        }

        return products;
    }

    private void mapColumnIndexes(Row headerRow) {
        columnIndexMap.clear();
        for (Cell cell : headerRow) {
            String columnName = cell.getStringCellValue().trim().toLowerCase();
            columnIndexMap.put(columnName, cell.getColumnIndex());

            // Log the column and its index for debugging purposes
            System.out.println("Column: " + columnName + " -> Index: " + cell.getColumnIndex());
        }
    }


    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        for (Cell cell : row) {
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }

    private String getCellValue(Row row, String columnName) {
        Integer index = columnIndexMap.get(columnName);
        if (index == null) return "";
        Cell cell = row.getCell(index);
        return (cell != null) ? cell.toString().trim() : "";
    }

    private Integer getIntCellValue(Row row, String columnName) {
        Integer index = columnIndexMap.get(columnName);
        if (index == null) return null;
        Cell cell = row.getCell(index);

        if (cell == null) return null;
        try {
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
            } else if (cell.getCellType() == CellType.STRING) {
                String value = cell.getStringCellValue().trim();
                return value.matches("\\d+") ? Integer.parseInt(value) : null;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error parsing number: " + cell.toString());
        }
        return null;
    }

    private String getStatusCellValue(Row row, String columnName) {
        Integer index = columnIndexMap.get(columnName);
        if (index == null) return "unavailable";
        Cell cell = row.getCell(index);

        if (cell == null) return "unavailable";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim().toLowerCase();
            case BOOLEAN -> cell.getBooleanCellValue() ? "available" : "unavailable";
            default -> "unavailable";
        };
    }
}
