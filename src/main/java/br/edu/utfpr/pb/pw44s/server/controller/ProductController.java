package br.edu.utfpr.pb.pw44s.server.controller;


import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.ProductMapper;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("products")
public class ProductController {

    private final IProductService productService;
    private final ProductMapper productMapper;

    public ProductController(IProductService productService,
                             ProductMapper productMapper) {
        this.productService = productService;
        this.productMapper = productMapper;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll() {
        return ResponseEntity.ok(
                this.productService.findAll()
                        .stream()
                        .map(productMapper::toDTO)
                        .collect(Collectors.toList())
        );
    }

    @PostMapping
    public ResponseEntity<ProductDTO> save(
            @RequestBody @Valid ProductDTO productDTO) {
        Product product = this.productService.save(
                productMapper.toEntity(productDTO)
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productMapper.toDTO(product));
    }

    // PUT -> http://localhost:8080/categories
    @PutMapping
    public ResponseEntity<ProductDTO> update(
            @RequestBody @Valid ProductDTO productDTO) {
        Product product = this.productService.save(
                productMapper.toEntity(productDTO)
        );
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(productMapper.toDTO(product));
    }

    // GET -> http://localhost:8080/products/:id onde :id é o código da categoria
    @GetMapping("{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        Product product = this.productService.findById(id);
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(
                    productMapper.toDTO(product));
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
       Product product = this.productService.findById(id);
        if (product != null) {
            this.productService.deleteById(id);
        }
    }

}
