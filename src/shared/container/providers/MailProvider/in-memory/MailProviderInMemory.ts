import { IMailProvider } from '../IMailProvider';

class MailProviderInMemory implements IMailProvider {
  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string,
  ): Promise<void> {
    // não
  }
}

export { MailProviderInMemory };
