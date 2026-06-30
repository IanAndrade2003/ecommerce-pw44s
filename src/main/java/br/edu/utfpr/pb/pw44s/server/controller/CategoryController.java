package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.CategoryDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.CategoryMapper;
import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.service.ICategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("categories")
public class CategoryController {

    private final ICategoryService categoryService;
    private final CategoryMapper categoryMapper;

    public CategoryController(ICategoryService categoryService,
                              CategoryMapper categoryMapper) {
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
    }

    // GET -> http://localhost:8080/categories
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> findAll() {
        return ResponseEntity.ok(
                this.categoryService.findAll()
                        .stream()
                        .map(categoryMapper::toDTO)
                        .collect(Collectors.toList())
        );
    }

    // POST -> http://localhost:8080/categories
    @PostMapping
    public ResponseEntity<CategoryDTO> save(
            @RequestBody @Valid CategoryDTO categoryDTO) {
        Category category = this.categoryService.save(
                categoryMapper.toEntity(categoryDTO)
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.categoryMapper.toDTO(category));
    }

    // PUT -> http://localhost:8080/categories
    @PutMapping
    public ResponseEntity<CategoryDTO> update(
            @RequestBody @Valid CategoryDTO categoryDTO) {
        Category category = this.categoryService.save(
                categoryMapper.toEntity(categoryDTO)
        );
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.categoryMapper.toDTO(category));
    }

    // GET -> http://localhost:8080/categories/:id onde :id é o código da categoria
    @GetMapping("{id}")
    public ResponseEntity<CategoryDTO> findById(@PathVariable Long id) {
        Category category = this.categoryService.findById(id);
        if (category != null) {
            return ResponseEntity.status(HttpStatus.OK).body(
                    this.categoryMapper.toDTO(category));
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        Category category = this.categoryService.findById(id);
        if (category != null) {
            this.categoryService.deleteById(id);
        }
    }

}
