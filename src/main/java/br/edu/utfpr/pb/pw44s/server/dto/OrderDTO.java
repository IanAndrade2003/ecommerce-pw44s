package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private LocalDateTime date;
    private Double totalValue;
    private List<OrderItemDTO> items;
}