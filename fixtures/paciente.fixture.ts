import { IPacienteRequest } from "../modules/paciente/repository/paciente.types";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { generateCPF } from "../shared/generateCpf";

export default {
    paciente: function() : IPacienteRequest {
        const data : IPacienteRequest = {
            name: faker.person.fullName(),
            document: generateCPF()
        }
        return data
    }
}