export type SerasaProps = SerasaGeneralDataProps | SerasaDebtsProps;

export type SerasaGeneralDataProps = {
  dataPrimeiraOcorrencia: string;
  dataUltimaOcorrencia: string;
  quantidadeOcorrencias: string;
};

export type SerasaDebtsProps = {
  data: string;
  tipoFinanc: string;
  aval: string;
  valor: string;
  contrato: string;
  origem: string;
  cidade?: string;
};

export type ProtestoProps = {
  data: string
  valorProtesto: string
  cartorio: string
  cidade: string
  uf: string
}

export type ScpcProps = {
  dtOcorr: string
  tpDevedor: string
  nome: string
  vrDivida: string
  cidade: string
  uf: string
  contrato?: string
  dtDisp: string
}

export type CadinProps = {
  sequencia: string;
  ate30Dias: string;
  apos30Dias: string;
};

export type RfbAndPgfnProps = {
  sequencia: string;
  siglaCredor: string;
  nomeCredor: string;
};

export type SiccfProps = {
  banco: string;
  agencia: string;
  tpConta: string;
  alinea: string;
  qteOcor: string;
  dataOcor: string;
  nome: string;
};

export type BadCheckProps = {
  dataCheque?: string;
  alinea: string;
  qteCheque: string;
  vlrCheque: string;
  banco: string;
  agencia: string;
  cidade: string;
  uf: string;
};

export type ResultProps = {
  [key: string]: {
    table?: HTMLElement | null
    debts: HTMLTableRowElement[]
    total: number
    debtsData: SerasaProps[] | ProtestoProps[] | ScpcProps[]
  }
}

export type CaixaDataResult = {
  [key: string]: {
    total: number
    data: SerasaProps[] | ProtestoProps[] | ScpcProps[]
  }
}
