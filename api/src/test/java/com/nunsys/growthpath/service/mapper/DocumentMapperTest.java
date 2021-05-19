package com.nunsys.growthpath.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DocumentMapperTest {

    private DocumentMapper documentMapper;

    @BeforeEach
    public void setUp() {
        documentMapper = new DocumentMapperImpl();
    }
}
