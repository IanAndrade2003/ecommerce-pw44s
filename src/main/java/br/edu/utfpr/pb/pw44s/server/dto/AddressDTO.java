package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddressDTO {
    private Long id;

    private Long userId;

    @NotNull
    private String street;

    private String complement;

    @NotNull
    private Long number;

    @NotNull
    private String zipCode;
}