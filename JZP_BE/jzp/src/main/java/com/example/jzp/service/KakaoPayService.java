package com.example.jzp.service;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import lombok.Data;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class KakaoPayService {

    @Value("${kakaopay.admin-key}")
    private String adminKey;

    @Value("${kakaopay.cid}")
    private String cid;

    private final RestTemplate restTemplate = new RestTemplate();

    public KakaoPayReadyResponse readyToPay() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("partner_order_id", "order1234");
        params.add("partner_user_id", "user1234");
        params.add("item_name", "가상결제");
        params.add("quantity", "1");
        params.add("total_amount", "1000");
        params.add("vat_amount", "100");
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://3.106.89.95:8080/api/movie/PaySuccess");
        params.add("cancel_url", "http://3.106.89.95:8080/api/movie/kakaoPayCancel");
        params.add("fail_url", "http://3.106.89.95:8080/api/movie/kakaoPayFail");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<KakaoPayReadyResponse> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/ready",
                request,
                KakaoPayReadyResponse.class
        );

        return response.getBody();
    }


    public static class KakaoPayReadyResponse {
        private String tid;

        @JsonProperty("next_redirect_pc_url")
        private String nextRedirectPcUrl;

        @JsonProperty("created_at")
        private String createdAt;

        public String getNextRedirectPcUrl() {
            return nextRedirectPcUrl;
        }
    }


}
