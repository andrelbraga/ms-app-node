import { Router } from 'express';

import { IController } from '../typings';

export abstract class Controller implements IController {
  abstract register(router: Router): void;
}
