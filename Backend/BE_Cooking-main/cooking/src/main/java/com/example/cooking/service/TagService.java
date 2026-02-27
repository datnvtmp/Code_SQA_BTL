package com.example.cooking.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.dto.TagDTO;
import com.example.cooking.dto.mapper.TagMapper;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Tag;
import com.example.cooking.repository.TagRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    // Tạo mới tag
    public TagDTO createTag(String tagName) {
        Tag tag = new Tag();
        tag.setName(tagName);
        if (tagRepository.existsByName(tag.getName())) {
            throw new CustomException("Tag with this name already exists");
        }
        tag = tagRepository.save(tag);
        TagDTO tagResponse = tagMapper.toTagResponse(tag);
        return tagResponse;
    }

    // // Cập nhật tag
    // public Tag updateTag(Long id, Tag tagDetails) {
    //     Tag tag = tagRepository.findById(id)
    //             .orElseThrow(() -> new EntityNotFoundException("Tag not found with id " + id));
    //     tag.setName(tagDetails.getName());
    //     tag.setSlug(tagDetails.getSlug()); // sẽ tự generate nếu rỗng
    //     return tagRepository.save(tag);
    // }

    // Xóa tag
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new CustomException("Tag not found with id " + id));
        tagRepository.delete(tag);
    }

    // Lấy theo ID
    public TagDTO getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new CustomException("Tag not found with id " + id));
        TagDTO tagResponse = tagMapper.toTagResponse(tag);
        return tagResponse;
    }
    // Lấy theo slug
    public TagDTO getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new CustomException("Tag not found with slug " + slug));

        TagDTO tagResponse = tagMapper.toTagResponse(tag);

        return tagResponse;
    }

    // Lấy tất cả tag
    public List<TagDTO> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<TagDTO> tagResponses = tagMapper.toTagResponseList(tags);
        return tagResponses;
    }

    public List<TagDTO> autocomplete(String keyword) {
        Pageable topTen = PageRequest.of(0, 10);
        return tagRepository.searchToDTO(keyword, topTen);
    }
}