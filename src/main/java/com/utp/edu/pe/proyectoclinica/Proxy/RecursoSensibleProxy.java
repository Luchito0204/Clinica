package com.utp.edu.pe.proyectoclinica.Proxy;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class RecursoSensibleProxy implements RecursoSensibleService {

    private final RecursoSensibleReal recursoReal;

    @Autowired
    public RecursoSensibleProxy(RecursoSensibleReal recursoReal) {
        this.recursoReal = recursoReal;
    }

    @Override
    public HistorialMedico accederAlRecurso(String token, Long id) {
        if (token == null || token.isBlank()) {
            System.out.println("Proxy: Acceso denegado. Token no valido");
            throw new SecurityException("Acceso denegado: Token no proporcionado.");
        }

        String tokenLimpio = token.trim();
        boolean tienePrefijoValido = tokenLimpio.startsWith("Bearer-") || tokenLimpio.startsWith("Bearer ");
        boolean esTokenValido = tienePrefijoValido && tokenLimpio.length() > 10;

        if (!esTokenValido) {
            System.out.println("Proxy: Acceso denegado. Token invalido!");
            throw new SecurityException("Acceso denegado: Token invalido.");
        }

        System.out.println("Proxy: Token verificado con exito para historial ID: " + id);
        return recursoReal.accederAlRecurso(tokenLimpio, id);
    }
}