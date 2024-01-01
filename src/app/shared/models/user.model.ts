
export class User {
  public id: string;
  public nome: string;
  public email: string;
  public senha: string;
  public perfil: string;
  constructor(element: User) {

      this.id = element.id;
      this.nome = element.nome;
      this.email = element.email;
      this.senha = element.senha;
      this.perfil = element.perfil;

  }

}
