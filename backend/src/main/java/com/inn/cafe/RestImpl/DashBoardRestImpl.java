package com.inn.cafe.RestImpl;

import com.inn.cafe.Rest.DashBoardRest;
import com.inn.cafe.Service.DashBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
public class DashBoardRestImpl implements DashBoardRest {

    @Autowired
    private DashBoardService dashBoardService;

    @Override
    public ResponseEntity<Map<String, Object>> getCount() {
//        try{
//            return dashBoardService.getCount();
//        }catch (Exception ex){
//        ex.printStackTrace();
//        }
        return dashBoardService.getCount();
    }
}
