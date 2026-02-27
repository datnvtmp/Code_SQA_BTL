package com.example.cooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.FileType;
import com.example.cooking.common.enums.UserStatus;
import com.example.cooking.dto.UserDTO;
import com.example.cooking.dto.mapper.UserMapper;
import com.example.cooking.dto.request.RegisterRequest;
import com.example.cooking.dto.request.ResetPassRequest;
import com.example.cooking.dto.request.UpdateProfileRequest;
import com.example.cooking.exception.CustomException;
import com.example.cooking.exception.DuplicateFieldException;
import com.example.cooking.exception.UserNotFoundException;
import com.example.cooking.model.RoleEntity;
import com.example.cooking.model.User;
import com.example.cooking.repository.RoleRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UploadFileService uploadFileService;
    private final RoleRepository roleRepository;
    private final SellerWalletService sellerWalletService;
    private final JwtService jwtService;
    @Transactional
    public Long addUser(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new CustomException("Mat khau xac nhan sai !");
        }
        User user = userMapper.toUser(registerRequest);
        RoleEntity userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new CustomException("role USER not found"));

        user.getRoles().add(userRole); // thêm vào danh sách roles
        user.setStatus(UserStatus.ACTIVE);

        // Xử lý avatar từ temp → folder chính
        MultipartFile avatarTempUrl = registerRequest.getAvatarUrl();
        if (avatarTempUrl != null && !avatarTempUrl.isEmpty()) {
            String avatarUrl = uploadFileService.saveFile(avatarTempUrl, FileType.AVATAR);
            user.setAvatarUrl(avatarUrl);
        } else {
            user.setAvatarUrl("/static_resource/public/upload/avatars/avatar_holder.png");
        }

        List<String> errors = new ArrayList<>();
        if (userRepository.existsByEmail(user.getEmail())) {
            errors.add("Email da ton tai");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            errors.add("Username da ton tai");
        }
        if (!errors.isEmpty()) {
            throw new DuplicateFieldException(errors);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return savedUser.getId();
    }
    

    @Transactional
    public Long addChef(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new CustomException("Mat khau xac nhan sai !");
        }
        User user = userMapper.toUser(registerRequest);
        RoleEntity userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new CustomException("role USER not found"));
        user.getRoles().add(userRole); // thêm vào danh sách roles

        userRole = roleRepository.findByName("CHEF")
                .orElseThrow(() -> new CustomException("role CHEF not found"));
        user.getRoles().add(userRole); // thêm vào danh sách roles
        user.setStatus(UserStatus.ACTIVE);

        // Xử lý avatar từ temp → folder chính
        MultipartFile avatarTempUrl = registerRequest.getAvatarUrl();
        if (avatarTempUrl != null && !avatarTempUrl.isEmpty()) {
            String avatarUrl = uploadFileService.saveFile(avatarTempUrl, FileType.AVATAR);
            user.setAvatarUrl(avatarUrl);
        } else {
            user.setAvatarUrl("/static_resource/public/upload/avatars/avatar_holder.png");
        }

        List<String> errors = new ArrayList<>();
        if (userRepository.existsByEmail(user.getEmail())) {
            errors.add("Email da ton tai");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            errors.add("Username da ton tai");
        }
        if (!errors.isEmpty()) {
            throw new DuplicateFieldException(errors);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        //tạo ví
        sellerWalletService.createWallet(user);
        return savedUser.getId();
    }
    @Transactional
    public void updatePassword(String token,ResetPassRequest resetPassRequest) {
        String email =resetPassRequest.getEmail();
        //Tìm user trong DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Token không hợp lệ hoặc email không tồn tại"));

        if (!jwtService.validateResetToken(token,email,user.getPassword())) {
            throw new CustomException("Token không hợp lệ hoặc email không tồn tại");
        }


        if (!resetPassRequest.getPassword().equals(resetPassRequest.getConfirmPassword())) {
            throw new CustomException("Mat khau xac nhan sai !");
        }


        //Cập nhật mật khẩu mới (đã mã hóa)
        user.setPassword(passwordEncoder.encode(resetPassRequest.getPassword()));
        userRepository.save(user);
    }
    @Transactional
    public UserDTO updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        List<String> errors = new ArrayList<>();
        // Update username (nếu gửi lên)
        if (request.getUsername() != null) {
            if (!request.getUsername().equals(user.getUsername())) {
                if (userRepository.existsByUsername(request.getUsername())) {
                    errors.add("Username đã tồn tại");
                } else {
                    user.setUsername(request.getUsername());
                }
            }
        }
        // // Update email (nếu gửi lên)
        // if (request.getEmail() != null) {
        //     if (!request.getEmail().equals(user.getEmail())) {
        //         if (userRepository.existsByEmail(request.getEmail())) {
        //             errors.add("Email đã tồn tại");
        //         } else {
        //             user.setEmail(request.getEmail());
        //         }
        //     }
        // }
        if (!errors.isEmpty()) {
            throw new DuplicateFieldException(errors);
        }
        // Update bio nếu gửi lên
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        // Update dob nếu gửi lên
        if (request.getDob() != null) {
            user.setDob(request.getDob());
        }

        // Update avatar nếu có upload
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            String avatarUrl = uploadFileService.saveFile(request.getAvatar(), FileType.AVATAR);
            user.setAvatarUrl(avatarUrl);
        }
        UserDTO updatedUserDTO = userMapper.toUserDTO(userRepository.save(user));
        return updatedUserDTO;
    }

    @Transactional
    public String upgradeToChef(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        RoleEntity chefRole = roleRepository.findByName("CHEF")
                .orElseThrow(() -> new CustomException("role CHEF not found"));

        // Nếu đã là CHEF rồi thì không thêm nữa
        if (user.getRoles().stream().anyMatch(r -> r.getName().equals("CHEF"))) {
            throw new CustomException("User đã là CHEF");
        }

        user.getRoles().add(chefRole);
        userRepository.save(user);

        return "Upgrade thành công! User hiện đã là CHEF.";
    }


    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        return userMapper.toUserDTO(user);
    }

    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException());
        return userMapper.toUserDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException());
        return userMapper.toUserDTO(user);
    }

    /**
     * Lấy danh sách User theo từ khóa tìm kiếm và phân trang.
     *
     * @param keyword Từ khóa tìm kiếm (có thể là username, email, hoặc bio)
     * @param page    Trang hiện tại (bắt đầu từ 0)
     * @param size    Kích thước của trang
     * @param sortBy  Trường để sắp xếp (ví dụ: "username", "createdAt")
     * @param sortDir Hướng sắp xếp ("asc" hoặc "desc")
     * @return Page chứa các đối tượng User đã được phân trang và lọc
     */
    public PageDTO<UserDTO> searchUsers(String keyword, int page, int size, String sortBy, String sortDir) {
        // Tạo đối tượng Sort
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        // Tạo đối tượng Pageable
        Pageable pageable = PageRequest.of(page, size, sort);

        // Gọi phương thức tìm kiếm từ Repository
        // Đảm bảo keyword không null, nếu null thì truyền chuỗi rỗng để tìm kiếm tất cả
        String searchKeyword = (keyword == null || keyword.trim().isEmpty()) ? "" : keyword.trim();
        Page<User> userPage = userRepository.searchUsersByKeyword(searchKeyword, pageable);
        if (userPage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        List<UserDTO> userDTOs = userMapper.toUserDTOList(userPage.getContent());
        return new PageDTO<>(userPage, userDTOs);
    }

}
