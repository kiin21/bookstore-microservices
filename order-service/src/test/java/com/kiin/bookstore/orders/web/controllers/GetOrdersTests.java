package com.kiin.bookstore.orders.web.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.kiin.bookstore.orders.AbstractIT;
import org.junit.jupiter.api.Test;

class GetOrdersTests extends AbstractIT {

    @Test
    void shouldGetOrdersSuccessfully() throws Exception {
        mockMvc.perform(get("/api/orders")).andExpect(status().isOk());
    }
}
