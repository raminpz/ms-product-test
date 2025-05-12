package org.pacifico.msproductest.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDto {
    private Long id;
    @NotNull(message = "El nombre no puede ser nulo")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 1 y 100 caracteres")
    private String name;

    @NotNull(message = "El precio no puede ser nulo")
    private Double price;

    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    private String description;
}
