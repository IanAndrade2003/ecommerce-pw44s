package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    Order toModel(OrderDTO dto);
    OrderDTO toDto(Order model);

    @Mapping(source = "productId", target = "product.id")
    @Mapping(target = "order", ignore = true)
    OrderItem toOrderItemModel(OrderItemDTO dto);

    @Mapping(source = "product.id", target = "productId")
    OrderItemDTO toOrderItemDto(OrderItem model);
}