package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.OrderMapper;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController {
    private final IOrderService orderService;
    private final OrderMapper orderMapper;

    public OrderController(IOrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    @PostMapping
    public OrderDTO create(@RequestBody OrderDTO orderDTO) {
        var order = orderMapper.toModel(orderDTO);
        return orderMapper.toDto(orderService.checkout(order));
    }

    @GetMapping
    public List<OrderDTO> list() {
        return orderService.findAllFromCurrentUser().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }
}