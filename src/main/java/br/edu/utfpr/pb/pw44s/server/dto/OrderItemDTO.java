package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long productId;
    private Integer quantity;
    private Double price;
}