package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-28T18:27:05-0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public Order toModel(OrderDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Order.OrderBuilder order = Order.builder();

        order.id( dto.getId() );
        order.date( dto.getDate() );
        order.totalValue( dto.getTotalValue() );
        order.items( orderItemDTOListToOrderItemList( dto.getItems() ) );

        return order.build();
    }

    @Override
    public OrderDTO toDto(Order model) {
        if ( model == null ) {
            return null;
        }

        OrderDTO orderDTO = new OrderDTO();

        orderDTO.setId( model.getId() );
        orderDTO.setDate( model.getDate() );
        orderDTO.setTotalValue( model.getTotalValue() );
        orderDTO.setItems( orderItemListToOrderItemDTOList( model.getItems() ) );

        return orderDTO;
    }

    @Override
    public OrderItem toOrderItemModel(OrderItemDTO dto) {
        if ( dto == null ) {
            return null;
        }

        OrderItem.OrderItemBuilder orderItem = OrderItem.builder();

        orderItem.product( orderItemDTOToProduct( dto ) );
        orderItem.quantity( dto.getQuantity() );
        orderItem.price( dto.getPrice() );

        return orderItem.build();
    }

    @Override
    public OrderItemDTO toOrderItemDto(OrderItem model) {
        if ( model == null ) {
            return null;
        }

        OrderItemDTO orderItemDTO = new OrderItemDTO();

        orderItemDTO.setProductId( modelProductId( model ) );
        orderItemDTO.setQuantity( model.getQuantity() );
        orderItemDTO.setPrice( model.getPrice() );

        return orderItemDTO;
    }

    protected List<OrderItem> orderItemDTOListToOrderItemList(List<OrderItemDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderItem> list1 = new ArrayList<OrderItem>( list.size() );
        for ( OrderItemDTO orderItemDTO : list ) {
            list1.add( toOrderItemModel( orderItemDTO ) );
        }

        return list1;
    }

    protected List<OrderItemDTO> orderItemListToOrderItemDTOList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderItemDTO> list1 = new ArrayList<OrderItemDTO>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( toOrderItemDto( orderItem ) );
        }

        return list1;
    }

    protected Product orderItemDTOToProduct(OrderItemDTO orderItemDTO) {
        if ( orderItemDTO == null ) {
            return null;
        }

        Product.ProductBuilder product = Product.builder();

        product.id( orderItemDTO.getProductId() );

        return product.build();
    }

    private Long modelProductId(OrderItem orderItem) {
        Product product = orderItem.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getId();
    }
}
