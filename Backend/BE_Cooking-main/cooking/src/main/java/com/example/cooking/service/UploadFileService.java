package com.example.cooking.service;

import org.springframework.web.multipart.MultipartFile;

import com.example.cooking.common.enums.FileType;

public interface UploadFileService {
    public String saveFile(MultipartFile file, FileType type);
    public String moveFileFromTempToFinal(String tempFilePath);
    public String saveTempFile(MultipartFile file, FileType type);
    boolean isValidFileUrl(String fileUrl, FileType type);

}
