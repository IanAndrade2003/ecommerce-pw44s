package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.AddressMapper;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("addresses")
public class AddressController {

    private final IAddressService addressService;
    private final AddressMapper addressMapper;

    public AddressController(IAddressService addressService, AddressMapper addressMapper) {
        this.addressService = addressService;
        this.addressMapper = addressMapper;
    }

    @PostMapping
    public AddressDTO create(@RequestBody @Valid AddressDTO addressDTO) {
        var addressModel = addressMapper.toModel(addressDTO);
        return addressMapper.toDto(addressService.save(addressModel));
    }

    @GetMapping
    public List<AddressDTO> list() {
        return addressService.findAllFromCurrentUser().stream()
                .map(addressMapper::toDto)
                .collect(Collectors.toList());
    }
}