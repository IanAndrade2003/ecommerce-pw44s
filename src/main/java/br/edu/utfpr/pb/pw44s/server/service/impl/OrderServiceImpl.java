package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.*;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public Order checkout(Order order) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findUserByUsername(username);

        order.setUser(user);
        order.setDate(LocalDateTime.now());

        double total = 0;
        for (OrderItem item : order.getItems()) {
            Product p = productRepository.findById(item.getProduct().getId()).orElseThrow();
            item.setPrice(p.getPrice());
            item.setOrder(order);
            total += item.getPrice() * item.getQuantity();
        }

        order.setTotalValue(total);
        return orderRepository.save(order);
    }

    @Override
    public List<Order> findAllFromCurrentUser() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findUserByUsername(username);
        return orderRepository.findByUser(user);
    }
}