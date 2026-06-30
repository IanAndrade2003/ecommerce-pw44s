package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-28T18:27:05-0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public Address toModel(AddressDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Address.AddressBuilder address = Address.builder();

        address.id( dto.getId() );
        address.street( dto.getStreet() );
        address.complement( dto.getComplement() );
        address.number( dto.getNumber() );
        address.zipCode( dto.getZipCode() );

        return address.build();
    }

    @Override
    public AddressDTO toDto(Address model) {
        if ( model == null ) {
            return null;
        }

        AddressDTO addressDTO = new AddressDTO();

        addressDTO.setUserId( modelUserId( model ) );
        addressDTO.setId( model.getId() );
        addressDTO.setStreet( model.getStreet() );
        addressDTO.setComplement( model.getComplement() );
        addressDTO.setNumber( model.getNumber() );
        addressDTO.setZipCode( model.getZipCode() );

        return addressDTO;
    }

    private Long modelUserId(Address address) {
        User user = address.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getId();
    }
}
