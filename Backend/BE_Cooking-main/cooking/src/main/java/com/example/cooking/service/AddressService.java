package com.example.cooking.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.dto.request.AddressRequestDto;
import com.example.cooking.dto.response.AddressResponseDto;
import com.example.cooking.model.Address;
import com.example.cooking.model.User;
import com.example.cooking.repository.AddressRepository;
import com.example.cooking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressResponseDto create(Long userId, AddressRequestDto dto) {
        User user = userRepository.getReferenceById(userId);

        Address address = new Address();
        address.setUser(user);
        mapToEntity(address, dto);
        return mapToDto(addressRepository.save(address));
    }

    public AddressResponseDto update(Long id, Long userId, AddressRequestDto dto) {
        Address address = getAddressOwnedByUser(id, userId);
        mapToEntity(address, dto);
        return mapToDto(address);
    }

    public void delete(Long id, Long userId) {
        Address address = getAddressOwnedByUser(id, userId);
        addressRepository.delete(address);
    }

    public List<AddressResponseDto> getByUser(Long userId) {
        User user = userRepository.getReferenceById(userId);
        return addressRepository.findByUser(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private Address getAddressOwnedByUser(Long id, Long userId) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        return address;
    }

    private void mapToEntity(Address address, AddressRequestDto dto) {
        address.setLabel(dto.getLabel());
        address.setLat(dto.getLat());
        address.setLng(dto.getLng());
        address.setAddressText(dto.getAddressText());
    }

    private AddressResponseDto mapToDto(Address address) {
        AddressResponseDto dto = new AddressResponseDto();
        dto.setId(address.getId());
        dto.setLabel(address.getLabel());
        dto.setLat(address.getLat());
        dto.setLng(address.getLng());
        dto.setAddressText(address.getAddressText());
        return dto;
    }
}
