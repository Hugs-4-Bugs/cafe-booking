# Cafe Management System

Welcome to the **Cafe Management System** repository! This project is designed to help manage a cafe, including tracking categories, items, and handling billing with PDF generation and a detailed dashboard for efficient management.

## Features

- **Product & Category Management:** Add, update, and manage products and their respective categories.
- **Billing & PDF Generation:** Generate bills in PDF format for customer orders.
- **Dashboard:** View and manage cafe items with detailed statistics and insights.
- **Order Tracking:** Track orders and their statuses.
- **User Authentication:** Role-based login system for admin and staff access.
- **Database Integration:** Store all cafe information in a MySQL database.
- **Excel Data Import:** Import product data from Excel files for easy bulk addition.

## Tech Stack

- **Backend:** Java, Spring Boot, Hibernate, JPA
- **Database:** MySQL
- **Frontend:** Thymeleaf (for views), Bootstrap (for styling)
- **PDF Generation:** Apache PDFBox
- **Excel Parsing:** Apache POI
- **Authentication:** Spring Security, JWT for user authentication

## Project Setup

### Prerequisites

- Java 11 or above
- MySQL
- Maven
- Spring Boot

### 1. Clone the Repository

```bash
git clone https://github.com/Hugs-4-Bugs/Cafe-Management-System.git
cd Cafe-Management-System
```

### 2. Configure Database

Create a MySQL database for the application and update the `application.properties` with the correct database details:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cafe_management_system
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Build and Run the Application

#### Using Maven:
```bash
mvn clean install
mvn spring-boot:run
```

#### Or by running the `CafeManagementSystemApplication` class from your IDE.

### 4. Access the Application

Once the application is running, you can access it at:

```
http://localhost:8080
```

### 5. User Authentication

- **Admin login:** admin@example.com / adminpassword
- **Staff login:** staff@example.com / staffpassword

## Endpoints

### 1. **Product Management**

- **GET /products** - View all products
- **POST /products** - Add a new product
- **PUT /products/{id}** - Update product details
- **DELETE /products/{id}** - Delete a product

### 2. **Category Management**

- **GET /categories** - View all categories
- **POST /categories** - Add a new category
- **PUT /categories/{id}** - Update category details
- **DELETE /categories/{id}** - Delete a category

### 3. **Order Management**

- **GET /orders** - View all orders
- **POST /orders** - Create a new order
- **PUT /orders/{id}** - Update order status
- **DELETE /orders/{id}** - Cancel an order

### 4. **PDF Billing**

- **GET /orders/{id}/bill** - Generate PDF bill for a specific order

## PDF Generation

The system uses Apache PDFBox to generate PDF bills for customer orders. When an order is placed, a PDF version of the bill can be downloaded.

## Dashboard

The dashboard provides an overview of:

- Total sales
- Number of orders
- Product and category distribution
- Pending orders

--- 

## Project Structure

```
📦 cafe-management-system
│── 📂 .github
│── 📂 Bill Document
│── 📂 src
│   ├── 📂 main
│   │   ├── 📂 java/com/inn/cafe
│   │   │   ├── 📂 Config
│   │   │   │   ├── SwaggerConfig.java
│   │   │   ├── 📂 Constants
│   │   │   │   ├── CafeConstants.java
│   │   │   ├── 📂 DAO
│   │   │   │   ├── BillDao.java
│   │   │   │   ├── CategoryDao.java
│   │   │   │   ├── PaymentDao.java
│   │   │   │   ├── ProductDao.java
│   │   │   │   ├── UserDao.java
│   │   │   ├── 📂 JWT
│   │   │   │   ├── CustomerUserDetailsService.java
│   │   │   │   ├── JwtFilter.java
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   ├── 📂 POJO
│   │   │   │   ├── Bill.java
│   │   │   │   ├── CardPayment.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Payment.java
│   │   │   │   ├── PaymentType.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── UPIPayment.java
│   │   │   │   ├── User.java
│   │   │   │   ├── WalletPayment.java
│   │   │   ├── 📂 Rest
│   │   │   │   ├── BillRest.java
│   │   │   │   ├── CategoryRest.java
│   │   │   │   ├── DashBoardRest.java
│   │   │   │   ├── PaymentRest.java
│   │   │   │   ├── ProductRest.java
│   │   │   │   ├── UserRest.java
│   │   │   ├── 📂 RestImpl
│   │   │   │   ├── BillRestImpl.java
│   │   │   │   ├── CategoryRestImpl.java
│   │   │   │   ├── DashBoardRestImpl.java
│   │   │   │   ├── PaymentRestImpl.java
│   │   │   │   ├── ProductRestImpl.java
│   │   │   │   ├── UserRestImpl.java
│   │   │   ├── 📂 Service
│   │   │   │   ├── BillService.java
│   │   │   │   ├── CategoryService.java
│   │   │   │   ├── DashBoardService.java
│   │   │   │   ├── ExcelService.java
│   │   │   │   ├── PaymentService.java
│   │   │   │   ├── ProductService.java
│   │   │   │   ├── UserService.java
│   │   │   ├── 📂 ServiceImpl
│   │   │   │   ├── BillServiceImpl.java
│   │   │   │   ├── CategoryServiceImpl.java
│   │   │   │   ├── DashBoardServiceImpl.java
│   │   │   │   ├── PaymentServiceImpl.java
│   │   │   │   ├── ProductServiceImpl.java
│   │   │   │   ├── UserServiceImpl.java
│   │   │   ├── 📂 Utils
│   │   │   │   ├── CafeUtils.java
│   │   │   │   ├── EmailUtils.java
│   │   │   │   ├── PaymentUtils.java
│   │   │   ├── 📂 Wrapper
│   │   │   │   ├── PaymentWrapper.java
│   │   │   │   ├── ProductWrapper.java
│   │   │   │   ├── UserWrapper.java
│   │   │   ├── CafeManagementSystemApplication.java
│   │   ├── 📂 resources
│   │   │   ├── application.properties
│   ├── 📂 test
│   │   ├── 📂 java/com/inn/cafe
│   │   │   ├── 📂 Service
│   │   │   │   ├── CategoryServiceIT.java
│   │   │   │   ├── CategoryServiceTest.java
│   │   │   │   ├── PaymentServiceTest.java
│   │   │   ├── CafeManagementSystemApplicationTests.java
│── 📂 target
│── Dockerfile
│── cafe-Dependency.txt
│── HELP.md
│── html Msg.pdf
│── mvnw
│── mvnw.cmd
│── pom.xml
│── ProductDetails.xlsx
│── ProductDetails12.xlsx
│── External Libraries
│── Scratches and Consoles
```




## How to Use the Application

1. Log in as an **Admin** or **Staff**.
2. Add products and categories through the **Product Management** and **Category Management** sections.
3. Place orders for customers and manage their statuses.
4. Generate PDF bills for completed orders from the **Order Management** section.
5. View sales and order statistics on the **Dashboard**.

## Sample Excel Format for Data Import

You can import product and category data into the database using an Excel file. Below is the sample format for the Excel sheet:

### **Product Data** (Sheet Name: **Products**)


| id  | description                                      | name                | price | status    | category_name |
|-----|--------------------------------------------------|---------------------|-------|-----------|---------------|
| 1   | Veggie Pizza with olives                        | Veggie Pizza        | 199   | available | Italian       |
| 2   | South Indian Masala Dosa                        | Masala Dosa         | 139   | available | Indian        |
| 3   | Spicy Paneer Samosa with chutney                | Paneer Samosa       | 79    | available | Snacks        |
| 4   | Litti-Chokha with roasted baingan               | Litti Chokha        | 149   | available | Bihari        |
| 5   | Butter Naan with garlic                        | Butter Naan         | 89    | available | Indian        |
| 6   | Lime-Mint Juice with fresh lemon                | Lime Juice          | 69    | available | Beverages     |
| 7   | Veggie Fried Rice with mixed veggies             | Veg Fried Rice       | 129   | available | Fried-Rice    |
| 8   | Tandoori Roti with butter                      | Tandoori Roti       | 79    | available | Roti sabji    |
| 9   | Cold Coffee with ice cream                     | Cold Coffee         | 159   | available | Cold Coffee   |
| 10  | Spicy Aloo Tikki with chutney                  | Aloo Tikki          | 89    | available | Dosa          |
| 11  | Sweet Lassi with mango flavor                  | Mango Lassi         | 69    | available | Lassi         |
| 12  | Paneer Butter Masala                           | Paneer Butter Masala| 179   | available | Indian        |
| 13  | Chole Bhature with onions                      | Chole Bhature       | 119   | available | Indian        |
| 14  | Vegetable Manchurian with rice                 | Veg Manchurian      | 169   | available | Chinese       |
| 15  | Pani Puri with chutney                        | Pani Puri           | 59    | available | Snacks        |



### Category Table Data
| id  | name           | version |
|-----|----------------|---------|
| 1   | Italian        | 0       |
| 2   | Indian         | 0       |
| 3   | Snacks         | 0       |
| 4   | Bihari         | 0       |
| 5   | Beverages      | 0       |
| 6   | Fried-Rice     | 0       |
| 7   | Roti sabji     | 0       |
| 8   | Cold Coffee    | 0       |
| 9   | Dosa           | 0       |
| 10  | Lassi          | 0       |
| 11  | Chinese        | 0       |


Make sure to follow this format while creating the Excel file to ensure the proper data structure. The **category_name** in the **Product** sheet should match an existing **category_name** from the **Categories** sheet for successful import.

### How to Upload Excel Data

- Navigate to the "Product Management" section of the dashboard.
- Click the "Import from Excel" button.
- Upload the properly formatted Excel file.
- The system will read the data and insert it into the database.

## Contribution

If you'd like to contribute to this project, feel free to:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

