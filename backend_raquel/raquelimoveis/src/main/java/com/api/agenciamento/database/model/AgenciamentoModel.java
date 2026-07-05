package com.api.agenciamento.database.model;

import com.api.agenciamento.enums.StatusAgenciamentos;
import com.api.agenciamento.enums.TipoImovel;
import com.api.foto.database.model.FotoModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "TB_AGENCIAMENTOS")
@Data
@NoArgsConstructor
public class AgenciamentoModel {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigoAgs;

    @Column(nullable = false, unique = false)
    @Size(min = 5, max = 150)
    private String titulo;

    @Column(nullable = true, length = 3000)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private  TipoImovel tipoImovel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAgenciamentos status;

    @DecimalMin(value = "1.00")
    @Column(nullable = false)
    private BigDecimal valorVenda;

    @Size(max = 100)
    @Column(nullable = false)
    private String cidade;

    @Size(max = 100)
    @Column(nullable = false)
    private String bairro;

    @Size(max = 150)
    @Column(nullable = true)
    private String rua;

    @Size(max = 20)
    @Column(nullable = true)
    private String numero;

    @Size(max = 100)
    @Column(nullable = true)
    private String complemento;

    @DecimalMin(value = "1.00")
    @Column(nullable = false)
    private BigDecimal areaM2;

    @Min(value = 0,message = "0")
    @Column(nullable = true)
    private Integer quartos;

    @Min(value = 0,message = "0")
    @Column(nullable = true)
    private Integer banheiros;

    @Min(value = 0,message = "0")
    @Column(nullable = true)
    private Integer vagasGaragem;

    @Column(name = "DT_HR_CRIADO")
    private LocalDateTime criadoEM;

    @PrePersist
    protected void onCreate(){
        this.criadoEM = LocalDateTime.now();
    }
    @Column(name = "DT_HR_ATUALIZADO")
    private LocalDateTime atualizadoEM;
    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEM = LocalDateTime.now();
    }
    @OneToMany(mappedBy = "agenciamentoModel", fetch = FetchType.LAZY)
    private Set<FotoModel> fotoModel;

    private String posicaoSolar;

    private Integer suite;
    @Column(nullable = false)
    private Boolean slideshow = false;
    @Column(nullable = false)
    private Boolean destaque = false;
}
