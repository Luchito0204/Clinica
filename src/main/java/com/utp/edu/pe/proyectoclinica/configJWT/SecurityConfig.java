package com.utp.edu.pe.proyectoclinica.configJWT;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas (Login, registro, archivos estáticos)
                        .requestMatchers("/api/auth/**", "/index.html", "/css/**", "/js/**").permitAll()

                        // Rutas protegidas que requerirán tu validación por token (ej. médicos, pacientes, citas)
                        .requestMatchers("/api/citas/**", "/api/pacientes/**").authenticated()

                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}