package com.example.cooking.service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.dto.paymentDTO.PaymentRequest;
import com.example.cooking.dto.paymentDTO.PaymentResponse;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.PackageUpgrade;
import com.example.cooking.model.UpgradeOrder;
import com.example.cooking.model.User;
import com.example.cooking.repository.PackageUpgradeRepository;
import com.example.cooking.repository.UpgradeOrderRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.io.UnsupportedEncodingException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PackageUpgradeService {

    private final PackageUpgradeRepository packageRepository;
    private final UpgradeOrderRepository upgradeOrderRepository;
    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public List<PackageUpgrade> getAllPackages() {
        return packageRepository.findAll();
    }

    // Có thể thêm create/update/delete nếu cần
    public PackageUpgrade createPackage(PackageUpgrade pkg) {
        return packageRepository.save(pkg);
    }

    //tạo payment nâng cấp gói
    @Transactional
    public PaymentResponse createPaymentForPackage (            
            HttpServletRequest request,
            Long packageId,
            String bankCode,
            MyUserDetails currentUser) throws UnsupportedEncodingException{
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + currentUser.getId()));
        boolean isAlreadyChef = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("CHEF"));
        if (isAlreadyChef) {
            throw new CustomException("User is already a CHEF");
        }        
        // Logic tạo payment cho gói nâng cấp
        PackageUpgrade pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found: " + packageId));

        //1.Tạo order nâng cấp gói (UpgradeOrder)
        UpgradeOrder upgradeOrder = UpgradeOrder.builder()
                .buyer(user)
                .packageUpgrade(pkg)
                .packageDurationDays(pkg.getDurationDays())
                .roleAssigned("CHEF")
                .totalAmount(pkg.getPrice())
                .orderInfo("Nang cap")
                .orderStatus(OrderStatus.PENDING_ACCOUNT_UPGRADE)
                .build();

        upgradeOrder = upgradeOrderRepository.save(upgradeOrder);


        PaymentRequest paymentRequest = PaymentRequest.builder()
                .order(upgradeOrder)
                .amount(pkg.getPrice())
                .bankCode(bankCode)
                .language("vn")
                .build();

        PaymentResponse paymentResponse = paymentService.createPayment(request, paymentRequest);

        return paymentResponse;
    }
}
