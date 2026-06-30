package br.edu.utfpr.pb.pw44s.server.service;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import java.util.List;

public interface IOrderService {
    Order checkout(Order order);
    List<Order> findAllFromCurrentUser();
}