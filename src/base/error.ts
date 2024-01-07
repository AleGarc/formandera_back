export class ErrorFormandera extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorFormandera.prototype);
  }
}

export class ErrorFormanderaNotFound extends ErrorFormandera {
  codigo: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorFormanderaNotFound.prototype);
    this.codigo = 404;
  }
}

export class ErrorFormanderaConflict extends ErrorFormandera {
  codigo: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorFormanderaConflict.prototype);
    this.codigo = 409;
  }
}

export class ErrorFormanderaBadRequest extends ErrorFormandera {
  codigo: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorFormanderaBadRequest.prototype);
    this.codigo = 400;
  }
}

export class ErrorFormanderaUnauthorized extends ErrorFormandera {
  codigo: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ErrorFormanderaUnauthorized.prototype);
    this.codigo = 401;
  }
}
