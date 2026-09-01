package com.dineflow.order.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.dineflow.order.dto.MenuItemResponse;
import com.dineflow.order.exception.ResourceNotFoundException;

@Component
@RequiredArgsConstructor
public class MenuServiceClient {

    private final RestClient restClient;

    @Value("${menu-service.url}")
    private String menuServiceUrl;

    public MenuItemResponse getMenuItem(Long menuItemId) {

        try {
            return restClient.get()
                    .uri(menuServiceUrl + "/api/menu-items/{id}", menuItemId)
                    .retrieve()
                    .body(MenuItemResponse.class);

        } catch (Exception e) {
            throw new ResourceNotFoundException(
                    "Unable to retrieve menu item: " + menuItemId
            );
        }
    }

    public void reduceStock(Long menuItemId, Integer quantity) {

        restClient.patch()
                .uri(menuServiceUrl+ "/api/menu-items/{id}/reduce-stock",menuItemId)
                .body(quantity)
                .retrieve()
                .toBodilessEntity();
    }
}
