package com.kiin.bookstore.catalog.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Cau hinh doc cho Catalog Service8
@Configuration
class OpenAPI3Configuration {

    @Value("${swagger.api-gateway-url}")
    String apiGatewayUrl;

    @Bean
    OpenAPI openApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Catalog Service APIs")
                        .description("BookStore Catalog Service APIs")
                        .version("v1.0.0"))
                .servers(List.of(new Server().url(apiGatewayUrl)));
    }
}
