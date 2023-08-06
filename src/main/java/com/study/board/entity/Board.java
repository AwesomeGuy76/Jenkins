package com.study.board.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;

@Entity
@Data
@Table(name = "video")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="video_id")
    private Integer id;

    private String VD_name;
    private String VD_cate;
    private String VD_runtime;
    private String VD_cum;
    private String VD_poster;
    private String VD_file;
    private Date VD_date;
}
