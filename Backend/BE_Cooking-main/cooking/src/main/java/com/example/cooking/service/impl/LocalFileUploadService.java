package com.example.cooking.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.cooking.common.enums.FileType;
import com.example.cooking.config.UploadProperties;
import com.example.cooking.exception.CustomException;
import com.example.cooking.service.UploadFileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocalFileUploadService implements UploadFileService {

    private final UploadProperties uploadProperties;

    /**
     * Lưu file theo type (avatar, recipe, step, temp)
     * @param file MultipartFile cần lưu
     * @param type Loại file / folder con: avatar, recipe, step, temp
     * @return đường dẫn truy cập
     */
    @Override
    public String saveFile(MultipartFile file, FileType type) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            String folder = getFolderByType(type);
            Path uploadPath = Paths.get(System.getProperty("user.dir"), folder);
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String safeFileName = sanitizeFileName(originalFilename);

            String fileName = UUID.randomUUID() + "_" + safeFileName;
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toFile());

            return "/" + folder + "/" + fileName;
        } catch (IOException e) {
            throw new CustomException("Fail to store file " + file.getOriginalFilename());
        }
    }


    /**
     * Lưu file tạm (temp) theo type gốc
     * VD: /uploads/temp/avatars/uuid.jpg
     */
    @Override
    public String saveTempFile(MultipartFile file, FileType type) {
        if (file == null || file.isEmpty()) return null;

        try {
            // Lưu vào temp/type folder
            String folder = getTempFolderByType(type);
            Path uploadPath = Paths.get(System.getProperty("user.dir"), folder);
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String safeFileName = sanitizeFileName(originalFilename);

            String fileName = UUID.randomUUID() + "_" + safeFileName;
            Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toFile()); 

            return "/" + folder + "/" + fileName;
        } catch (IOException e) {
            throw new CustomException("Fail to store file " + file.getOriginalFilename());
        }
    }

    /**
     * Move file từ temp sang folder chính dựa vào folder con trong temp path
     * VD: /uploads/temp/avatars/uuid.jpg -> /uploads/avatars/uuid.jpg
     */
    @Override
    public String moveFileFromTempToFinal(String tempFilePath) {
        try {
            if (tempFilePath == null || tempFilePath.isEmpty()) return null;

            Path sourcePath = Paths.get(System.getProperty("user.dir"), tempFilePath.replaceFirst("/", ""));
            if (!Files.exists(sourcePath)) {
                throw new CustomException("Temp file not found: " + tempFilePath);
            }

            // Lấy folder con trong temp để xác định type
            Path tempFolder = sourcePath.getParent(); // .../uploads/temp/avatars
            String typeFolderName = tempFolder.getFileName().toString(); // avatars, recipes, steps

            FileType originalType;
            switch (typeFolderName.toLowerCase()) {
                case "avatars": originalType = FileType.AVATAR; break;
                case "recipes": originalType = FileType.RECIPE; break;
                case "steps":  originalType = FileType.STEP; break;
                case "dishs":  originalType = FileType.DISH; break;
                case "chats":  originalType = FileType.CHAT; break;
                default: throw new CustomException("Unknown type folder in temp: " + typeFolderName);
            }

            String targetFolder = getFolderByType(originalType);
            Path targetDir = Paths.get(System.getProperty("user.dir"), targetFolder);
            Files.createDirectories(targetDir);

            Path targetPath = targetDir.resolve(sourcePath.getFileName());
            Files.move(sourcePath, targetPath);

            return "/" + targetFolder + "/" + sourcePath.getFileName().toString();
        } catch (IOException e) {
            throw new CustomException("Failed to move file from temp: " + tempFilePath);
        }
    }

    @Override
    public boolean isValidFileUrl(String fileUrl, FileType type) {
        if (fileUrl == null || fileUrl.isBlank()) return false;

        // URL phải bắt đầu bằng '/uploads/...'
        String requiredPrefix = "/" + getFolderByType(type) + "/";

        if (!fileUrl.startsWith(requiredPrefix)) {
            return false;
        }

        // Check file tồn tại thật
        Path filePath = Paths.get(System.getProperty("user.dir"), fileUrl.replaceFirst("/", ""));
        return Files.exists(filePath);
    }


    /**
     * Xác định folder lưu theo type
     */
    private String getFolderByType(FileType type) {
        if (type == null) return uploadProperties.getTemp();
        switch (type) {
            case AVATAR: return uploadProperties.getAvatar();
            case RECIPE:   return uploadProperties.getRecipe();
            case STEP:   return uploadProperties.getStep();
            case RECIPEVIDEO:   return uploadProperties.getRecipeVideo();
            case CATEGORYIMAGE:   return uploadProperties.getCategoryImage();
            case DISH:   return uploadProperties.getDish();
            case CHAT:   return uploadProperties.getChat();
            case TEMP:
            default:     return uploadProperties.getTemp();
        }
    }

    private String getTempFolderByType(FileType type) {
        if (type == null) type = FileType.TEMP;
        switch (type) {
            case AVATAR: return uploadProperties.getTemp() + "/avatars";
            case RECIPE:   return uploadProperties.getTemp() + "/recipes";
            case STEP:   return uploadProperties.getTemp() + "/steps";
            case DISH:   return uploadProperties.getTemp() + "/dishs";
            case CHAT:   return uploadProperties.getTemp() + "/chats";
            
            case TEMP:
            default:     return uploadProperties.getTemp() + "/others";
        }
    }

    /**
     * Chuẩn hóa tên file: bỏ khoảng trắng, ký tự đặc biệt
     */
    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "file";
        fileName = fileName.trim().replaceAll("\\s+", "_");
        fileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "");
        return fileName;
    }
}
