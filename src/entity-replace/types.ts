export interface NLPModel {
  entities: NLPEntity[];
  intents: NLPIntent[];
}

export interface NLPEntity {
  id: string;
  options: EnityOption[];
}

export interface EnityOption {
  id: string;
  examples: string[];
}

export interface NLPIntent {
  id: string;
  utterances: string[];
}
