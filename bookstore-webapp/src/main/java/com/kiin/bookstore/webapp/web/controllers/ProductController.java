package com.kiin.bookstore.webapp.web.controllers;

import com.kiin.bookstore.webapp.web.clients.catalog.CatalogServiceClient;
import com.kiin.bookstore.webapp.web.clients.catalog.PagedResult;
import com.kiin.bookstore.webapp.web.clients.catalog.Product;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
class ProductController {
    CatalogServiceClient catalogServiceClient;
    ProductController(CatalogServiceClient catalogServiceClient) {
        this.catalogServiceClient = catalogServiceClient;
    }

    @GetMapping
    String index() {
        return "redirect:/products";
    }

    @GetMapping("/products")
    String productsPage(@RequestParam(name = "page", defaultValue = "1") int pagNo, Model model) {
        model.addAttribute("pageNo", pagNo);
        return "products";
    }

    @GetMapping("/api/products")
    @ResponseBody
    PagedResult<Product> getProducts(@RequestParam(name = "page", defaultValue = "1") int pagNo) {
        return catalogServiceClient.getProducts(pagNo);
    }
}
