package com.study.board.controller;

import com.study.board.entity.Board;
import com.study.board.service.BoardService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class BoardController {

    @Autowired
    private BoardService boardService;
    @GetMapping("/board/write")
    public String boardWriteForm(){
        return "boardwrite";
    }
    @PostMapping("/board/writepro")

    public String boardWritePro(Board board){
//        System.out.println(board.getTitle());
//        System.out.println(board.getContent());
        boardService.write(board);
         return "";
    }

    @GetMapping("/home")
    public String boardList(Model model){
        model.addAttribute("list", boardService.boardList());
        return "main";
    }

    @GetMapping("/board/view")
    public String boardView(Model model, Integer id){
        model.addAttribute("board", boardService.boardView(id));
        return "videoview";
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/home";
    }
}
