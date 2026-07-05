package com.api.foto.database.model;

import com.api.agenciamento.database.model.AgenciamentoModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "TB_FOTOS")
@Data
@NoArgsConstructor
public class FotoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nome_do_arquivo", nullable = false)
    private String nomeArquivo;
    @Column(name = "nome_armazenado", nullable = false, unique = true)
    private String nomeArmazenado;
    @Column(name = "tipo_de_imagem", nullable = false)
    private String contentType;
    @Column(name = "tamanho_do_arquivo", nullable = false)
    private Long tamanho;
    @Column(name = "URL", nullable = false)
    private String url;
    @ManyToOne
    @JoinColumn(name = "agenciamento_id", nullable = false) // Da o nome para a coluna com o relacionamento
    private AgenciamentoModel agenciamentoModel;
    @Column(nullable = false)
    private Boolean principal = false;
    @Column(name = "DT_HR_CRIADO")
    private LocalDateTime criadoEM;
    @PrePersist
    protected void onCreate(){this.criadoEM = LocalDateTime.now();

    }
}
