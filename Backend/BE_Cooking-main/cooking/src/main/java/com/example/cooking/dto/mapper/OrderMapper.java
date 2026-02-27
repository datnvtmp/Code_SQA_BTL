package com.example.cooking.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.cooking.dto.DishOrderDTO;
import com.example.cooking.dto.DishOrderDetailDTO;
import com.example.cooking.model.DishOrder;

@Mapper(componentModel = "spring",uses = {UserMapper.class})
public interface OrderMapper {
    DishOrderDTO toDTO (DishOrder dishOrder);
    List<DishOrderDTO> tDtos(List<DishOrder> dishOrders);
    
    @Mapping(target="dishInOrderDtos", ignore = true)
    DishOrderDetailDTO toDetailDTO(DishOrder dishOrder);
}