package com.utp.edu.pe.proyectoclinica.Proxy;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;



public class RecursoSensibleProxy implements RecursoSensibleService{
    private final RecursoSensibleReal recursoReal;

    public RecursoSensibleProxy(RecursoSensibleReal recursoReal) {
        this.recursoReal = recursoReal;
    }

    @Override
    public HistorialMedico accederAlRecurso(String token, Long id) {
        if (token != null && token.startsWith("Bearer-Admin")) {
            System.out.println("Proxy: Token verificado con exito.");
            return recursoReal.accederAlRecurso(token, id);
        } else {
            System.out.println("Proxy: Acceso denegado. Token inválido! ");
            throw new SecurityException("Acceso denegado: Token de administrador inválido.");
        }
    }
}
