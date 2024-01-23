export class CustomException extends Error {
  context: string;
  type: string;

  constructor(context: string, type: string, message?: string) {
    super(message);
    this.name = 'CUSTOM_EXCEPTION';
    this.context = context;
    this.type = type;
  }
}
