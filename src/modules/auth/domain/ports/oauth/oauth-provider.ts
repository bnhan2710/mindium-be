export interface IDPToken { 
  accessToken: string;
  idToken: string;
}

export interface IOAuthProvider {
    exchangeWithIDP(code: string): Promise<IDPToken>;
    fetchProfile(idpToken: IDPToken): Promise<any>;
}