export class Client {
  constructor(
    readonly id: string,
    private name: string,
    private email: string,
  ) {}

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  changeName(newName: string) {
    this.name = newName;
  }

  changeEmail(newEmail: string) {
    this.email = newEmail;
  }
}
