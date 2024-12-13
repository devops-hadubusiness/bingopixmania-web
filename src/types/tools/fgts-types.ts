export type AuthResponseProps = {
  authenticated: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
  message: string;
  token_bearer: string;
  jwt_token: string;
};

export type GetCurretnLocationResponseProps = {
  latitude: number;
  longitude: number;
}

type ConsultaCCF619 = {
  estadocivil: string;
  info_restricao: string;
  dt_nascimento: string;
  idade: string;
  pais_nascimento: string;
  data_nascimento: string;
  signo: string;
  cpf: string;
  estado_nascimento: string;
  consultas_realizadas: string;
  conjuge_cpf: string;
  codigo_consulta: string;
  nome_pai: string;
  identidade: string;
  cidade_nascimento: string;
  filiacao: string;
  conjuge_nome: string;
  nome_mae: string;
  sexo: string;
  statusReceita: string;
  nome_completo: string;
};

type Endereco = {
  uf: string;
  cidade: string;
  complemento: string;
  endereco: string;
  numero: string;
  contador: string;
  bairro: string;
  cep: string;
};

type ComercialTelefone = {
  whatsapp: string;
  dt_istalacao: string;
  telefone: string;
  cidade: string;
  endereco: string;
  numero: string;
  bairro: string;
  estadocivil: string | null;
  nome: string;
  procon: string;
  cpfcnpj: string;
  cep: string;
  mae: string;
  nasc: string;
  emails: string;
  uf: string;
  complemento: string;
  statustelefone: string;
  atualizacao: string;
  contador: string;
  sexo: string;
  titulo_eleitor: string;
  operadora: string;
};

type ConsultaTelefoneProprietario = {
  whatsapp: string;
  dt_istalacao: string;
  telefone: string;
  cidade: string;
  endereco: string;
  numero: string;
  bairro: string;
  estadocivil: string;
  nome: string;
  procon: string;
  cpfcnpj: string;
  cep: string;
  mae: string;
  nasc: string;
  emails: string;
  uf: string;
  complemento: string;
  statustelefone: string;
  atualizacao: string;
  contador: string;
  sexo: string;
  titulo_eleitor: string;
  operadora: string;
};

type CredilinkWebservice = {
  consulta_ccf619: ConsultaCCF619;
  outros_enderecos: {
      endereco: Endereco;
  };
  consulta_telefone_referencia: object;
  comercial: {
      telefone: ComercialTelefone[];
  };
  rendapresumida: string;
  consulta_emails_proprietario: {
      emails: string;
  };
  consulta_telefone_proprietario: {
      telefone: ConsultaTelefoneProprietario[];
  };
  outros_contatos: {
      telefone: any[];
  };
};

export type GetDataByCpfResponseProps = {
  code_message: string;
  code: string;
  service: string;
  credilink_webservice: CredilinkWebservice;
};

export type GetListQueryActiveByRegisterResponseProps = {
  StatusCode: number;
  Result: string;
  Message: string;
  Erro: string | null;
  Data: ClienteDataProps[];
  // Data: {
  //     Id: number;
  //     CpfCliente: string;
  //     IdUsuario: number;
  //     DataHora: string;
  //     Status: boolean;
  //     NumeroDocumento: string | null;
  //     DataReferencia: string;
  //     NumeroContratosAtivos: number;
  //     PossuiSaldoDisponivel: boolean;
  //     KeyAvailableBalance: string | null;
  //     UpdatedSaldo: string;
  //     ErrorEnumerator: string | null;
  //     QuerySource: number;
  //     IdUsuarioUpdate: number;
  //     DataHoraUpdate: string;
  //     SubStatus: number;
  //     Feedback: string | null;
  //     ElegivelTac: boolean;
  //     Quantidade: number;
  //     NomeFintech: string | null;
  //     NomeCorban: string | null;
  //     QueryBySpreadsheet: boolean;
  //     ValueBalance: number;
  //     Parcelas: any[];
  // }[];
}

export type ClienteDataProps = {
  Id: number;
  CpfCliente: string;
  IdUsuario: number;
  DataHora: string;
  Status: boolean;
  NumeroDocumento: string | null;
  DataReferencia: string;
  NumeroContratosAtivos: number;
  PossuiSaldoDisponivel: boolean;
  KeyAvailableBalance: string | null;
  UpdatedSaldo: string;
  ErrorEnumerator: string | null;
  QuerySource: number;
  IdUsuarioUpdate: number;
  DataHoraUpdate: string;
  SubStatus: number;
  Feedback: string | null;
  ElegivelTac: boolean;
  Quantidade: number;
  NomeFintech: string | null;
  NomeCorban: string | null;
  QueryBySpreadsheet: boolean;
  ValueBalance: number;
  Parcelas: any[];
}
