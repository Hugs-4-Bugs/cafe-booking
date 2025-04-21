package com.inn.cafe.ServiceImpl;

import com.inn.cafe.Constents.CafeConstants;
import com.inn.cafe.DAO.BillDao;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Bill;
import com.inn.cafe.Service.BillService;
import com.inn.cafe.Utils.CafeUtils;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.IOUtils;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;


@Slf4j
@Service
public class BillServiceImpl implements BillService {

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    BillDao billDao;

    @Override
    public ResponseEntity<String> generateReport(Map<String, Object> requestMap) {
        log.info("Inside generateReport");
        try {
            /**
             * Stores the file name of the report.
             * - If the report already exists, it retrieves the filename using 'uuid' from requestMap.
             * - If a new report is generated, a new filename will be assigned.
             */
            String fileName;

            /**
             * Validate the requestMap to check if it contains the necessary data
             * before proceeding with report generation.
             */
            if (validateRequestMap(requestMap)) {

                /**
                 * Report generation can be handled in two ways:
                 * 1. If `isGenerate` is false, it means the report already exists in the database.
                 *    - Retrieve its filename using `uuid` from requestMap.
                 * 2. If `isGenerate` is true, it means a new report needs to be generated.
                 *
                 * Example Scenario:
                 * ----------------
                 * - A user purchased a product one year ago and now wants to claim a warranty.
                 * - They request a copy of the invoice.
                 * - Instead of generating a new invoice, the system retrieves the existing invoice using
                 *   the stored `uuid` and returns it.
                 * - If the invoice does not exist, the system will generate a new one.
                 */

                if (requestMap.containsKey("isGenerate") && !(Boolean) requestMap.get("isGenerate")) {

                    /**
                     * `isGenerate` is false, meaning the report has already been generated and stored.
                     * Retrieve the existing report’s filename using the provided UUID.
                     */
                    fileName = (String) requestMap.get("uuid");

                } else {

                    /**
                     * `isGenerate` is true, meaning a new report needs to be generated.
                     * Assign a new filename and proceed with report generation.
                     */
                    // Logic to generate and save a new report
                    fileName = CafeUtils.getUUID();  // check the getUUID implementation in CafeUtils class
                    requestMap.put("uuid", fileName);
                    insertBill(requestMap);
                }
                String data = "Name: " + requestMap.get("name") + "\n" + "Contact Number: " + requestMap.get("contact") +
                        "\n" + "Email: " + requestMap.get("email") + "\n" + "Payment Method: " + requestMap.get("paymentMethod");

                Document document = new Document();   // this is for user details on pdf in normal text size
//                PdfWriter.getInstance(document, new FileOutputStream(CafeConstants.STORE_LOCATION + "//" + fileName + ".pdf"));   /** '\\' for windows & '//' for mac/Linux */
                PdfWriter.getInstance(document, new FileOutputStream(CafeConstants.STORE_LOCATION + File.separator + fileName + ".pdf"));
                document.open();
                setRectangleInPdf(document);

                Paragraph chunk = new Paragraph("Cafe Management System", getFont("Header"));  // this will be the header name on pdf
                chunk.setAlignment(Element.ALIGN_CENTER);
                document.add(chunk);

                Paragraph paragraph = new Paragraph(data + "\n \n", getFont("Data"));
                document.add(paragraph);

                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);
                addTableHeader(table);

                // productDetails is in the object so, we need to typecast to the String
                // see getJsonArrayFromString implementation in CafeUtils class
                JSONArray jsonArray = CafeUtils.getJsonArrayFromString((String) requestMap.get("productDetails"));
                for (int i = 0; i < jsonArray.length(); i++) {
                    addRows(table, CafeUtils.getMapFromJson(jsonArray.getString(i)));
                }
                document.add(table);

                Paragraph footer = new Paragraph("Total : " + requestMap.get("totalAmount") + "\n"
                        + "Thank you for visiting. Please visit again!", getFont("Data"));
                document.add(footer);
                document.close();

                return new ResponseEntity<>("{\"uuid\":\" " + fileName + "\"}", HttpStatus.OK);
            }
            /** If requestMap validation fails, return a BAD_REQUEST response.*/
            return CafeUtils.getResponseEntity("Required data not found", HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        /** If an unexpected error occurs, return an INTERNAL_SERVER_ERROR response. */
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    private void addRows(PdfPTable table, Map<String, Object> data) {
        log.info("Inside addRows");
        table.addCell((String) data.get("name"));
        table.addCell((String) data.get("category"));
//        table.addCell((String) data.get("quantity"));
        table.addCell(String.valueOf(data.get("quantity")));
        table.addCell(Double.toString((Double) data.get("price")));
        table.addCell(Double.toString((Double) data.get("total")));
    }


    private void addTableHeader(PdfPTable table) {
        log.info("Inside addTableHeader");
        Stream.of("Name", "Category", "Quantity", "Price", "Sub Total")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    header.setBorderWidth(2);
                    header.setPhrase(new Phrase(columnTitle));
                    header.setBackgroundColor(BaseColor.YELLOW);
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setVerticalAlignment(Element.ALIGN_CENTER);
                    table.addCell(header);
                });
    }


    private Font getFont(String type) {
        log.info("Inside getFont");
        switch (type) {
            case "Header":
                Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 18, BaseColor.BLACK);
                headerFont.setStyle(Font.BOLD);
                return headerFont;
            case "Data":
                Font dataFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, BaseColor.BLACK);
                dataFont.setStyle(Font.BOLD);
                return dataFont;
            default:
                return new Font();
        }
    }


    private void setRectangleInPdf(Document document) throws DocumentException {
        log.info("Inside setRectangleInPdf");
        Rectangle rectangle = new Rectangle(577, 825, 18, 15);
        rectangle.enableBorderSide(1);
        rectangle.enableBorderSide(2);
        rectangle.enableBorderSide(4);
        rectangle.enableBorderSide(8);
//        rectangle.setBackgroundColor(BaseColor.WHITE);
        rectangle.setBackgroundColor(new BaseColor(230, 230, 230)); // Light gray
        rectangle.setBorderWidth(1);
        document.add(rectangle);
    }


    private void insertBill(Map<String, Object> requestMap) {
        try {
            Bill bill = new Bill();
            bill.setUuid((String) requestMap.get("uuid"));
            bill.setName((String) requestMap.get("name"));
            bill.setEmail((String) requestMap.get("email"));
            bill.setContactNumber((String) requestMap.get("contactNumber"));
            bill.setPaymentMethod((String) requestMap.get("paymentMethod"));
//            bill.setTotal(Integer.parseInt((String) requestMap.get("totalAmount")));
            bill.setTotal(Double.valueOf(requestMap.get("totalAmount").toString()).intValue());

            bill.setProductDetails((String) requestMap.get("productDetails"));
            bill.setCreatedBy(jwtFilter.getCurrentUser());
            billDao.save(bill);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }


    private boolean validateRequestMap(Map<String, Object> requestMap) {
        return requestMap.containsKey("name") &&
                requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("email") &&
                requestMap.containsKey("paymentMethod") &&
                requestMap.containsKey("productDetails") &&
                requestMap.containsKey("totalAmount");
    }


    // method to get the list of bills by admin (Admin can see the list of bills which he has generated only)
    @Override
    public ResponseEntity<List<Bill>> getBills() {
        log.info("Inside getBills");
//        List<Bill> list = new ArrayList<>();  // can be also written as [ List<Bill> list; ]
        List<Bill> list;
        if (jwtFilter.isAdmin()) {
            list = billDao.getAllBills();
        } else {
            list = billDao.getBillByUserName(jwtFilter.getCurrentUser());
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }


    /** this method will generate new pdf with that id we will pass for the user we want to generate the bill
      in pdf format in case the user requests or need the bill report for business purpose

     first it will check whether this file is actually exists in our database or not. if not then will generate new bill report for requested user.
     */
    @Override
    public ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap) {
        log.info("Inside getPdf : requestMap {}", requestMap);

        try {
            byte[] byteArray = new byte[0];
            if (!requestMap.containsKey("uuid") && validateRequestMap(requestMap)) {
                return new ResponseEntity<>(byteArray, HttpStatus.BAD_REQUEST);
            }
            // write the method to check whether this file is actually exists in our database or not
            String filePath = CafeConstants.STORE_LOCATION + "//" + (String) requestMap.get("uuid") + ".pdf";   /** '\\' for windows & '//' for mac/Linux */
//            String filePath = CafeConstants.STORE_LOCATION + File.separator + requestMap.get("uuid") + ".pdf";  // Best Solution → Use File.separator (Recommended)

            if (CafeUtils.isFileExists(filePath)) {
                byteArray = getByteArray(filePath);
                // now we have to return the byteArray into the API
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            } else {
                requestMap.put("isGenerate", false);
                generateReport(requestMap);
                byteArray = getByteArray(filePath);
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }


    private byte[] getByteArray(String filePath) throws Exception {
        File initialFile = new File(filePath);
        InputStream targetStream = new FileInputStream(initialFile);
        byte[] byteArray = IOUtils.toByteArray(targetStream);
        targetStream.close();
        return byteArray;
    }


    @Override
    public ResponseEntity<String> deleteBill(Integer id) {
        log.info("Inside deleteBill {}", id);
        try {
            // we will check first whether this id is present in the database or not
            Optional optional = billDao.findById(id);
            if (!optional.isEmpty()) {
                billDao.deleteById(id);
                return CafeUtils.getResponseEntity("Bill Deleted Successfully", HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity("Bill id does not exists", HttpStatus.OK);

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

}
