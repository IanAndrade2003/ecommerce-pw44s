package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tb_address")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String street;

    private String complement;

    @NotNull
    private Long number;

    @NotNull
    private String zipCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}