package br.edu.utfpr.pb.pw44s.server.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    
    public enum Status {
        APROVADO,
        RECUSADO
    }

    public Status processar(double valor, double limite) {
        if (valor > limite) {
            return Status.RECUSADO;
        }
        return Status.APROVADO;
    }
}
