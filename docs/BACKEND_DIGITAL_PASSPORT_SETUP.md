# Guide d'implémentation Backend - Passeport Numérique

Ce document décrit comment implémenter le backend Java Spring Boot pour le système de passeport numérique des produits.

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Entités JPA](#entités-jpa)
3. [DTOs](#dtos)
4. [Repository](#repository)
5. [Service](#service)
6. [Controller](#controller)
7. [Base de données](#base-de-données)
8. [Validation](#validation)
9. [Exemples de données](#exemples-de-données)

---

## 🏗️ Architecture

```
com.infotech.ecommerce
├── entity/
│   ├── DigitalPassport.java
│   ├── CarbonFootprint.java
│   ├── Traceability.java
│   ├── Material.java
│   ├── Durability.java
│   ├── Certification.java
│   └── RecyclingInfo.java
├── dto/
│   ├── DigitalPassportDto.java
│   └── CreateDigitalPassportRequest.java
├── repository/
│   └── DigitalPassportRepository.java
├── service/
│   └── DigitalPassportService.java
└── controller/
    └── DigitalPassportController.java
```

---

## 📦 Entités JPA

### 1. DigitalPassport.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreatedDate;
import org.hibernate.annotations.UpdatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "digital_passports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalPassport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long productId;
    
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "carbon_footprint_id", referencedColumnName = "id")
    private CarbonFootprint carbonFootprint;
    
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "traceability_id", referencedColumnName = "id")
    private Traceability traceability;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "passport_id")
    private List<Material> materials;
    
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "durability_id", referencedColumnName = "id")
    private Durability durability;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "passport_id")
    private List<Certification> certifications;
    
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recycling_info_id", referencedColumnName = "id")
    private RecyclingInfo recyclingInfo;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdatedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

### 2. CarbonFootprint.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carbon_footprints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarbonFootprint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Double totalCO2; // en kg
    
    @Column(nullable = false)
    private Double manufacturing;
    
    @Column(nullable = false)
    private Double transportation;
    
    @Column(nullable = false)
    private Double usage;
    
    @Column(nullable = false)
    private Double endOfLife;
    
    @Column(nullable = false, length = 1)
    private String score; // A, B, C, D, E
}
```

### 3. Traceability.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "traceability")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Traceability {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String originCountry;
    
    @Column(nullable = false)
    private String manufacturer;
    
    private String factory;
    
    @ElementCollection
    @CollectionTable(name = "supply_chain_journey", joinColumns = @JoinColumn(name = "traceability_id"))
    @Column(name = "step")
    private List<String> supplyChainJourney;
    
    @Column(nullable = false)
    private Integer transparencyScore; // 0-100
}
```

### 4. Material.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Double percentage;
    
    @Column(nullable = false)
    private Boolean renewable;
    
    @Column(nullable = false)
    private Boolean recycled;
    
    @Column(nullable = false)
    private Boolean recyclable;
    
    private String origin;
}
```

### 5. Durability.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "durability")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Durability {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer expectedLifespanYears;
    
    @Column(nullable = false)
    private Double repairabilityScore; // 0-10
    
    @Column(nullable = false, length = 1)
    private String repairabilityIndex; // A, B, C, D, E
    
    @Column(nullable = false)
    private Boolean sparePartsAvailable;
    
    private Integer warrantyYears;
    
    private Boolean softwareUpdates;
}
```

### 6. Certification.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "certifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String issuer;
    
    @Column(nullable = false)
    private LocalDate validUntil;
    
    private String logoUrl;
    
    private String verificationUrl;
    
    @Column(nullable = false)
    private String type; // ENVIRONMENTAL, QUALITY, SAFETY, ETHICAL
}
```

### 7. RecyclingInfo.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "recycling_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecyclingInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Double recyclablePercentage;
    
    @Column(columnDefinition = "TEXT")
    private String instructions;
    
    @Column(nullable = false)
    private Boolean takeBackProgram;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recycling_info_id")
    private List<CollectionPoint> collectionPoints;
}
```

### 8. CollectionPoint.java

```java
package com.infotech.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "collection_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionPoint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String distance;
    
    @ElementCollection
    @CollectionTable(name = "collection_point_materials", joinColumns = @JoinColumn(name = "collection_point_id"))
    @Column(name = "material")
    private List<String> acceptedMaterials;
}
```

---

## 📝 DTOs

### 1. CreateDigitalPassportRequest.java

```java
package com.infotech.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDigitalPassportRequest {
    
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotNull(message = "Carbon footprint is required")
    @Valid
    private CarbonFootprintDto carbonFootprint;
    
    @NotNull(message = "Traceability is required")
    @Valid
    private TraceabilityDto traceability;
    
    @NotNull(message = "Materials list is required")
    @Size(min = 1, message = "At least one material is required")
    @Valid
    private List<MaterialDto> materials;
    
    @NotNull(message = "Durability is required")
    @Valid
    private DurabilityDto durability;
    
    @Valid
    private List<CertificationDto> certifications;
    
    @NotNull(message = "Recycling info is required")
    @Valid
    private RecyclingInfoDto recyclingInfo;
    
    // Nested DTOs
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CarbonFootprintDto {
        @NotNull @Positive
        private Double totalCO2;
        
        @NotNull @PositiveOrZero
        private Double manufacturing;
        
        @NotNull @PositiveOrZero
        private Double transportation;
        
        @NotNull @PositiveOrZero
        private Double usage;
        
        @NotNull @PositiveOrZero
        private Double endOfLife;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TraceabilityDto {
        @NotBlank
        private String originCountry;
        
        @NotBlank
        private String manufacturer;
        
        private String factory;
        
        private List<String> supplyChainJourney;
        
        @NotNull @Min(0) @Max(100)
        private Integer transparencyScore;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MaterialDto {
        @NotBlank
        private String name;
        
        @NotNull @Positive @Max(100)
        private Double percentage;
        
        @NotNull
        private Boolean renewable;
        
        @NotNull
        private Boolean recycled;
        
        @NotNull
        private Boolean recyclable;
        
        private String origin;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DurabilityDto {
        @Positive
        private Integer expectedLifespanYears;
        
        @NotNull @DecimalMin("0.0") @DecimalMax("10.0")
        private Double repairabilityScore;
        
        @NotNull
        private Boolean sparePartsAvailable;
        
        @Positive
        private Integer warrantyYears;
        
        private Boolean softwareUpdates;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CertificationDto {
        @NotBlank
        private String name;
        
        @NotBlank
        private String issuer;
        
        @NotNull @Future
        private LocalDate validUntil;
        
        private String logoUrl;
        
        private String verificationUrl;
        
        @NotBlank
        private String type;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecyclingInfoDto {
        @NotNull @Min(0) @Max(100)
        private Double recyclablePercentage;
        
        private String instructions;
        
        @NotNull
        private Boolean takeBackProgram;
        
        private List<CollectionPointDto> collectionPoints;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollectionPointDto {
        @NotBlank
        private String name;
        
        @NotBlank
        private String address;
        
        @NotBlank
        private String distance;
        
        private List<String> acceptedMaterials;
    }
}
```

### 2. DigitalPassportDto.java

```java
package com.infotech.ecommerce.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalPassportDto {
    private Long id;
    private Long productId;
    private CarbonFootprintResponse carbonFootprint;
    private TraceabilityResponse traceability;
    private List<MaterialResponse> materials;
    private DurabilityResponse durability;
    private List<CertificationResponse> certifications;
    private RecyclingInfoResponse recyclingInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Nested response classes (similar to request DTOs but without validation)
    // ... (copy structure from CreateDigitalPassportRequest and rename to *Response)
}
```

---

## 🗄️ Repository

```java
package com.infotech.ecommerce.repository;

import com.infotech.ecommerce.entity.DigitalPassport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DigitalPassportRepository extends JpaRepository<DigitalPassport, Long> {
    Optional<DigitalPassport> findByProductId(Long productId);
    boolean existsByProductId(Long productId);
    void deleteByProductId(Long productId);
}
```

---

## 🔧 Service

```java
package com.infotech.ecommerce.service;

import com.infotech.ecommerce.dto.CreateDigitalPassportRequest;
import com.infotech.ecommerce.dto.DigitalPassportDto;
import com.infotech.ecommerce.entity.*;
import com.infotech.ecommerce.repository.DigitalPassportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DigitalPassportService {
    
    private final DigitalPassportRepository digitalPassportRepository;
    
    @Transactional(readOnly = true)
    public DigitalPassportDto getByProductId(Long productId) {
        log.info("Fetching digital passport for product ID: {}", productId);
        
        DigitalPassport passport = digitalPassportRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Digital passport not found for product: " + productId));
        
        return mapToDto(passport);
    }
    
    @Transactional
    public DigitalPassportDto create(CreateDigitalPassportRequest request) {
        log.info("Creating digital passport for product ID: {}", request.getProductId());
        
        // Validate materials sum to 100%
        double totalPercentage = request.getMaterials().stream()
                .mapToDouble(CreateDigitalPassportRequest.MaterialDto::getPercentage)
                .sum();
        
        if (Math.abs(totalPercentage - 100.0) > 0.01) {
            throw new IllegalArgumentException("Materials percentages must sum to 100%");
        }
        
        // Check if passport already exists for this product
        if (digitalPassportRepository.existsByProductId(request.getProductId())) {
            throw new IllegalArgumentException("Digital passport already exists for product: " + request.getProductId());
        }
        
        DigitalPassport passport = mapToEntity(request);
        passport.setCreatedAt(LocalDateTime.now());
        passport.setUpdatedAt(LocalDateTime.now());
        
        DigitalPassport saved = digitalPassportRepository.save(passport);
        log.info("Digital passport created with ID: {}", saved.getId());
        
        return mapToDto(saved);
    }
    
    @Transactional
    public DigitalPassportDto update(Long id, CreateDigitalPassportRequest request) {
        log.info("Updating digital passport ID: {}", id);
        
        DigitalPassport passport = digitalPassportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Digital passport not found: " + id));
        
        // Update all fields
        updatePassportFromRequest(passport, request);
        passport.setUpdatedAt(LocalDateTime.now());
        
        DigitalPassport updated = digitalPassportRepository.save(passport);
        log.info("Digital passport updated: {}", id);
        
        return mapToDto(updated);
    }
    
    @Transactional
    public void delete(Long id) {
        log.info("Deleting digital passport ID: {}", id);
        
        if (!digitalPassportRepository.existsById(id)) {
            throw new RuntimeException("Digital passport not found: " + id);
        }
        
        digitalPassportRepository.deleteById(id);
        log.info("Digital passport deleted: {}", id);
    }
    
    // Helper: Calculate carbon score
    public String calculateCarbonScore(Double totalCO2) {
        if (totalCO2 < 10) return "A";
        if (totalCO2 < 25) return "B";
        if (totalCO2 < 50) return "C";
        if (totalCO2 < 100) return "D";
        return "E";
    }
    
    // Helper: Calculate repairability index
    public String calculateRepairabilityIndex(Double score) {
        if (score >= 8) return "A";
        if (score >= 6) return "B";
        if (score >= 4) return "C";
        if (score >= 2) return "D";
        return "E";
    }
    
    // Mapping methods
    private DigitalPassport mapToEntity(CreateDigitalPassportRequest request) {
        // Carbon Footprint
        CarbonFootprint carbonFootprint = CarbonFootprint.builder()
                .totalCO2(request.getCarbonFootprint().getTotalCO2())
                .manufacturing(request.getCarbonFootprint().getManufacturing())
                .transportation(request.getCarbonFootprint().getTransportation())
                .usage(request.getCarbonFootprint().getUsage())
                .endOfLife(request.getCarbonFootprint().getEndOfLife())
                .score(calculateCarbonScore(request.getCarbonFootprint().getTotalCO2()))
                .build();
        
        // Traceability
        Traceability traceability = Traceability.builder()
                .originCountry(request.getTraceability().getOriginCountry())
                .manufacturer(request.getTraceability().getManufacturer())
                .factory(request.getTraceability().getFactory())
                .supplyChainJourney(request.getTraceability().getSupplyChainJourney())
                .transparencyScore(request.getTraceability().getTransparencyScore())
                .build();
        
        // Materials
        var materials = request.getMaterials().stream()
                .map(m -> Material.builder()
                        .name(m.getName())
                        .percentage(m.getPercentage())
                        .renewable(m.getRenewable())
                        .recycled(m.getRecycled())
                        .recyclable(m.getRecyclable())
                        .origin(m.getOrigin())
                        .build())
                .collect(Collectors.toList());
        
        // Durability
        Durability durability = Durability.builder()
                .expectedLifespanYears(request.getDurability().getExpectedLifespanYears())
                .repairabilityScore(request.getDurability().getRepairabilityScore())
                .repairabilityIndex(calculateRepairabilityIndex(request.getDurability().getRepairabilityScore()))
                .sparePartsAvailable(request.getDurability().getSparePartsAvailable())
                .warrantyYears(request.getDurability().getWarrantyYears())
                .softwareUpdates(request.getDurability().getSoftwareUpdates())
                .build();
        
        // Certifications (optional)
        var certifications = request.getCertifications() != null ? 
                request.getCertifications().stream()
                        .map(c -> Certification.builder()
                                .name(c.getName())
                                .issuer(c.getIssuer())
                                .validUntil(c.getValidUntil())
                                .logoUrl(c.getLogoUrl())
                                .verificationUrl(c.getVerificationUrl())
                                .type(c.getType())
                                .build())
                        .collect(Collectors.toList()) : 
                List.of();
        
        // Recycling Info
        var collectionPoints = request.getRecyclingInfo().getCollectionPoints() != null ?
                request.getRecyclingInfo().getCollectionPoints().stream()
                        .map(cp -> CollectionPoint.builder()
                                .name(cp.getName())
                                .address(cp.getAddress())
                                .distance(cp.getDistance())
                                .acceptedMaterials(cp.getAcceptedMaterials())
                                .build())
                        .collect(Collectors.toList()) :
                List.of();
        
        RecyclingInfo recyclingInfo = RecyclingInfo.builder()
                .recyclablePercentage(request.getRecyclingInfo().getRecyclablePercentage())
                .instructions(request.getRecyclingInfo().getInstructions())
                .takeBackProgram(request.getRecyclingInfo().getTakeBackProgram())
                .collectionPoints(collectionPoints)
                .build();
        
        return DigitalPassport.builder()
                .productId(request.getProductId())
                .carbonFootprint(carbonFootprint)
                .traceability(traceability)
                .materials(materials)
                .durability(durability)
                .certifications(certifications)
                .recyclingInfo(recyclingInfo)
                .build();
    }
    
    private DigitalPassportDto mapToDto(DigitalPassport passport) {
        // Implement mapping from entity to DTO
        // Similar structure, reverse of mapToEntity
        // ... (implementation details)
        return null; // TODO: Implement full mapping
    }
    
    private void updatePassportFromRequest(DigitalPassport passport, CreateDigitalPassportRequest request) {
        // Update all nested entities
        // ... (implementation details)
    }
}
```

---

## 🌐 Controller

```java
package com.infotech.ecommerce.controller;

import com.infotech.ecommerce.dto.CreateDigitalPassportRequest;
import com.infotech.ecommerce.dto.DigitalPassportDto;
import com.infotech.ecommerce.service.DigitalPassportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/digital-passports")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class DigitalPassportController {
    
    private final DigitalPassportService digitalPassportService;
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<DigitalPassportDto> getByProductId(@PathVariable Long productId) {
        log.info("REST request to get digital passport for product: {}", productId);
        DigitalPassportDto passport = digitalPassportService.getByProductId(productId);
        return ResponseEntity.ok(passport);
    }
    
    @PostMapping
    public ResponseEntity<DigitalPassportDto> create(@Valid @RequestBody CreateDigitalPassportRequest request) {
        log.info("REST request to create digital passport for product: {}", request.getProductId());
        DigitalPassportDto created = digitalPassportService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DigitalPassportDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateDigitalPassportRequest request) {
        log.info("REST request to update digital passport: {}", id);
        DigitalPassportDto updated = digitalPassportService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete digital passport: {}", id);
        digitalPassportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 🗃️ Base de données

### Script SQL de création

```sql
-- Carbon Footprints
CREATE TABLE carbon_footprints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_co2 DOUBLE NOT NULL,
    manufacturing DOUBLE NOT NULL,
    transportation DOUBLE NOT NULL,
    usage DOUBLE NOT NULL,
    end_of_life DOUBLE NOT NULL,
    score VARCHAR(1) NOT NULL
);

-- Traceability
CREATE TABLE traceability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    origin_country VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    factory VARCHAR(255),
    transparency_score INT NOT NULL
);

CREATE TABLE supply_chain_journey (
    traceability_id BIGINT NOT NULL,
    step VARCHAR(255),
    FOREIGN KEY (traceability_id) REFERENCES traceability(id) ON DELETE CASCADE
);

-- Durability
CREATE TABLE durability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    expected_lifespan_years INT,
    repairability_score DOUBLE NOT NULL,
    repairability_index VARCHAR(1) NOT NULL,
    spare_parts_available BOOLEAN NOT NULL,
    warranty_years INT,
    software_updates BOOLEAN
);

-- Recycling Info
CREATE TABLE recycling_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recyclable_percentage DOUBLE NOT NULL,
    instructions TEXT,
    take_back_program BOOLEAN NOT NULL
);

-- Collection Points
CREATE TABLE collection_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recycling_info_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    FOREIGN KEY (recycling_info_id) REFERENCES recycling_info(id) ON DELETE CASCADE
);

CREATE TABLE collection_point_materials (
    collection_point_id BIGINT NOT NULL,
    material VARCHAR(100),
    FOREIGN KEY (collection_point_id) REFERENCES collection_points(id) ON DELETE CASCADE
);

-- Digital Passports
CREATE TABLE digital_passports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE,
    carbon_footprint_id BIGINT,
    traceability_id BIGINT,
    durability_id BIGINT,
    recycling_info_id BIGINT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (carbon_footprint_id) REFERENCES carbon_footprints(id),
    FOREIGN KEY (traceability_id) REFERENCES traceability(id),
    FOREIGN KEY (durability_id) REFERENCES durability(id),
    FOREIGN KEY (recycling_info_id) REFERENCES recycling_info(id)
);

-- Materials
CREATE TABLE materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passport_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    percentage DOUBLE NOT NULL,
    renewable BOOLEAN NOT NULL,
    recycled BOOLEAN NOT NULL,
    recyclable BOOLEAN NOT NULL,
    origin VARCHAR(255),
    FOREIGN KEY (passport_id) REFERENCES digital_passports(id) ON DELETE CASCADE
);

-- Certifications
CREATE TABLE certifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passport_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    valid_until DATE NOT NULL,
    logo_url VARCHAR(500),
    verification_url VARCHAR(500),
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (passport_id) REFERENCES digital_passports(id) ON DELETE CASCADE
);
```

---

## ✅ Validation

### Règles de validation importantes

1. **Composition des matériaux**: La somme des pourcentages doit égaler 100%
2. **Score de réparabilité**: Entre 0 et 10
3. **Score de transparence**: Entre 0 et 100
4. **Dates de certification**: `validUntil` doit être dans le futur
5. **Product ID unique**: Un seul passeport par produit
6. **CO2 positif**: Toutes les valeurs de CO2 doivent être >= 0

---

## 📊 Exemples de données

### Exemple 1: Smartphone écologique

```json
{
  "productId": 101,
  "carbonFootprint": {
    "totalCO2": 42.5,
    "manufacturing": 30.0,
    "transportation": 5.5,
    "usage": 5.0,
    "endOfLife": 2.0
  },
  "traceability": {
    "originCountry": "France",
    "manufacturer": "FairPhone",
    "factory": "Factory A - Netherlands",
    "supplyChainJourney": [
      "Raw materials - Congo (Conflict-free)",
      "Components manufacturing - China (Fair Trade)",
      "Assembly - Netherlands",
      "Distribution - Europe"
    ],
    "transparencyScore": 95
  },
  "materials": [
    {
      "name": "Aluminium recyclé",
      "percentage": 40.0,
      "renewable": false,
      "recycled": true,
      "recyclable": true,
      "origin": "Europe"
    },
    {
      "name": "Plastique bio-sourcé",
      "percentage": 30.0,
      "renewable": true,
      "recycled": false,
      "recyclable": true,
      "origin": "France"
    },
    {
      "name": "Composants électroniques",
      "percentage": 25.0,
      "renewable": false,
      "recycled": false,
      "recyclable": true,
      "origin": "Asie"
    },
    {
      "name": "Verre",
      "percentage": 5.0,
      "renewable": false,
      "recycled": true,
      "recyclable": true,
      "origin": "Europe"
    }
  ],
  "durability": {
    "expectedLifespanYears": 7,
    "repairabilityScore": 9.2,
    "sparePartsAvailable": true,
    "warrantyYears": 3,
    "softwareUpdates": true
  },
  "certifications": [
    {
      "name": "Fair Trade Certified",
      "issuer": "Fair Trade International",
      "validUntil": "2026-12-31",
      "logoUrl": "https://example.com/fairtrade.png",
      "verificationUrl": "https://fairtrade.org/verify/12345",
      "type": "ETHICAL"
    },
    {
      "name": "Energy Star",
      "issuer": "EPA",
      "validUntil": "2025-06-30",
      "type": "ENVIRONMENTAL"
    }
  ],
  "recyclingInfo": {
    "recyclablePercentage": 95.0,
    "instructions": "Déposez votre ancien appareil dans un point de collecte agréé. Toutes les pièces seront récupérées et recyclées.",
    "takeBackProgram": true,
    "collectionPoints": [
      {
        "name": "Ecosystem - Paris 10",
        "address": "15 Rue du Faubourg Montmartre, 75010 Paris",
        "distance": "2.3 km",
        "acceptedMaterials": ["Électronique", "Batteries", "Plastique"]
      },
      {
        "name": "Darty - Gare du Nord",
        "address": "23 Boulevard de Denain, 75010 Paris",
        "distance": "3.1 km",
        "acceptedMaterials": ["Électronique", "Batteries"]
      }
    ]
  }
}
```

### Exemple 2: Vêtement durable

```json
{
  "productId": 102,
  "carbonFootprint": {
    "totalCO2": 8.2,
    "manufacturing": 4.5,
    "transportation": 2.2,
    "usage": 1.0,
    "endOfLife": 0.5
  },
  "traceability": {
    "originCountry": "Portugal",
    "manufacturer": "EcoThreads",
    "factory": "Porto Textile Mill",
    "supplyChainJourney": [
      "Coton biologique - Inde (GOTS certifié)",
      "Filature - Portugal",
      "Teinture naturelle - Portugal",
      "Confection - Portugal"
    ],
    "transparencyScore": 88
  },
  "materials": [
    {
      "name": "Coton biologique",
      "percentage": 95.0,
      "renewable": true,
      "recycled": false,
      "recyclable": true,
      "origin": "Inde"
    },
    {
      "name": "Élasthanne",
      "percentage": 5.0,
      "renewable": false,
      "recycled": false,
      "recyclable": false,
      "origin": "Europe"
    }
  ],
  "durability": {
    "expectedLifespanYears": 5,
    "repairabilityScore": 7.5,
    "sparePartsAvailable": false,
    "warrantyYears": 2,
    "softwareUpdates": null
  },
  "certifications": [
    {
      "name": "GOTS (Global Organic Textile Standard)",
      "issuer": "Control Union",
      "validUntil": "2026-03-15",
      "logoUrl": "https://example.com/gots.png",
      "verificationUrl": "https://global-standard.org/verify/67890",
      "type": "ENVIRONMENTAL"
    },
    {
      "name": "Oeko-Tex Standard 100",
      "issuer": "Oeko-Tex",
      "validUntil": "2025-09-30",
      "type": "SAFETY"
    }
  ],
  "recyclingInfo": {
    "recyclablePercentage": 95.0,
    "instructions": "Ce vêtement peut être recyclé en fibres textiles. Déposez-le propre et sec dans un conteneur de recyclage textile.",
    "takeBackProgram": true,
    "collectionPoints": [
      {
        "name": "Le Relais - Conteneur Textile",
        "address": "Parking Carrefour, Avenue Jean Jaurès",
        "distance": "1.5 km",
        "acceptedMaterials": ["Textile", "Chaussures", "Maroquinerie"]
      }
    ]
  }
}
```

---

## 🚀 Étapes de mise en œuvre

1. **Créer les entités JPA** dans le package `entity`
2. **Créer les DTOs** dans le package `dto`
3. **Créer le repository** `DigitalPassportRepository`
4. **Implémenter le service** avec toute la logique métier
5. **Créer le controller REST** avec les endpoints
6. **Exécuter le script SQL** pour créer les tables
7. **Tester avec Postman/cURL** les endpoints CRUD
8. **Intégrer avec le frontend Angular** déjà créé

---

## 📌 Notes importantes

- Utilisez `@Transactional` pour les opérations d'écriture
- Gérez les exceptions avec `@ControllerAdvice` pour des messages d'erreur clairs
- Ajoutez des logs avec `@Slf4j` pour faciliter le débogage
- Testez la validation des matériaux (somme = 100%)
- Implémentez des tests unitaires pour le service
- Configurez CORS pour autoriser les requêtes depuis Angular (localhost:4200)

---

**Prochaines étapes**: Une fois le backend implémenté, vous pourrez créer le formulaire de création de passeport numérique côté Angular et l'intégrer dans le flux de création de produit.
