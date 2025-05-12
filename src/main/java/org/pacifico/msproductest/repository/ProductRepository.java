package org.pacifico.msproductest.repository;

import org.pacifico.msproductest.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
