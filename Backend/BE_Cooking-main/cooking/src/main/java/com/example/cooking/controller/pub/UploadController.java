package com.example.cooking.controller.pub;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.enums.FileType;
import com.example.cooking.exception.CustomException;
import com.example.cooking.service.UploadFileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final UploadFileService uploadFileService;

    // // ===================== AVATAR =====================
    // @PostMapping(path = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<ApiResponse<String>> uploadAvatarTemp(@RequestParam("file") MultipartFile file) {
    //     String tempUrl = uploadFileService.saveTempFile(file, FileType.AVATAR);
    //     return ApiResponse.ok(tempUrl);
    // }

    // // ===================== recipe =====================
    // @PostMapping(path = "/recipe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<ApiResponse<String>> uploadDishTemp(@RequestParam("file") MultipartFile file) {
    //     String tempUrl = uploadFileService.saveTempFile(file, FileType.RECIPE);
    //     return ApiResponse.ok(tempUrl);
    // }

    // // ===================== STEP =====================
    // @PostMapping(path = "/step", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<ApiResponse<String>> uploadStepTemp(@RequestParam("file") MultipartFile file) {
    //     String tempUrl = uploadFileService.saveTempFile(file, FileType.STEP);
    //     return ApiResponse.ok(tempUrl);
    // }

    // ===================== VIDEO =====================
    @PostMapping(path = "/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadVideo(@RequestParam("file") MultipartFile video) {
        if (video == null || video.isEmpty()) {
            throw new CustomException("Video is empty");
        }
        String url = uploadFileService.saveFile(video, FileType.RECIPEVIDEO);
        return ApiResponse.ok(url);
    }
}
