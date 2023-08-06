package com.study.board.service;

import com.study.board.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.study.board.entity.Board;

import java.util.List;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    //글작성
    public void write(Board board){
        boardRepository.save(board);

    }
    //리스트 처리
    public List<Board> boardList(){
        return boardRepository.findAll();
    }

    //게시글상세
    public Board boardView(Integer id){
        return boardRepository.findById(id).get();
    }
}
