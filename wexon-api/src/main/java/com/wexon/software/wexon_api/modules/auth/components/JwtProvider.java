package com.wexon.software.wexon_api.modules.auth.components;

import com.wexon.software.wexon_api.modules.auth.data.UserPrinciple;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;


import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtProvider {

    private final SecretKey jwtKey = Keys.hmacShaKeyFor("WexonSecretKeyForJwtAuthMustBeAtLeast32Bytes!".getBytes());

    public String generateToken(
            Authentication authentication
    ) {

        //24 Hours
        long jwtExpirationMs = 86400000;
        Instant expirationTime = Instant.now().plus(jwtExpirationMs, ChronoUnit.HOURS);
        Date expirationDate = Date.from(expirationTime);
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();

        return Jwts.builder()
                .subject(userPrinciple.getUsername())
                .expiration(expirationDate)
                .signWith(jwtKey)
                .compact();

    }

    public String getUserNameFromToken(String token) {

        return Jwts.parser()
                .verifyWith(jwtKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

    }

    public boolean verifyToken(String token) {

        try{

            Jwts.parser()
                    .verifyWith(jwtKey)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception e){
            return false;

        }

    }

}
