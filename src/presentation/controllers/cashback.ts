import { Router, Request, Response, NextFunction } from 'express';
import { Controller } from '.';
import { Container } from '../../infra';
import { IContainer } from '../typings';
import { cashbackSchema, validatorMiddleware, getClientCredentials, getUserInfo } from '../middlewares';
import { paymentSlipCashbackActive } from '../../domain/models';

export class CashbackController extends Controller {
  private cashbackService: IContainer['cashbackService'];
  private authService: IContainer['authService'];

  constructor(container: Container) {
    super();
    this.cashbackService = container.cashbackService;
    this.authService = container.authService;
  }

  register(router: Router): void {
    router
      .route('/campaigns/active')
      .get(
        validatorMiddleware(cashbackSchema),
        getClientCredentials(this.authService),
        getUserInfo(),
        this.getActive.bind(this),
      );
    router
      .route('/campaigns/:id/reschedule')
      .patch(
        validatorMiddleware(cashbackSchema),
        getClientCredentials(this.authService),
        getUserInfo(),
        this.reschedule.bind(this),
      );
    router
      .route('/campaigns')
      .post(
        validatorMiddleware(cashbackSchema),
        getClientCredentials(this.authService),
        getUserInfo(),
        this.post.bind(this),
      );
    router
      .route('/campaigns')
      .get(
        validatorMiddleware(cashbackSchema),
        getClientCredentials(this.authService),
        getUserInfo(),
        this.list.bind(this),
      );
    router
      .route('/campaigns/:id')
      .put(
        validatorMiddleware(cashbackSchema),
        getClientCredentials(this.authService),
        getUserInfo(),
        this.put.bind(this),
      );
    router
      .route('/campaigns/:id')
      .get(
        validatorMiddleware(cashbackSchema),
        getClientCredentials(this.authService),
        getUserInfo(),
        this.get.bind(this),
      );
    router
      .route('/v1/cashback/campaigns/:id')
      .patch(
        validatorMiddleware(cashbackSchema),
        getClientCredentials(this.authService),
        getUserInfo(),
        this.patch.bind(this),
      );
  }
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { scopedApplicationToken, userToken } = res.locals;
      const campaign = await this.cashbackService.get(
        id,
        scopedApplicationToken,
        userToken,
      );

      res.send(campaign);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, page, ...filters } = req.query;
      const { scopedApplicationToken, userToken, platform } = res.locals;

      const campaigns = await this.cashbackService.list(
        {
          limit,
          page,
        },
        filters,
        platform,
        scopedApplicationToken,
        userToken,
      );
      res.send(campaigns);
    } catch (error) {
      next(error);
    }
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;

      const { scopedApplicationToken, userToken, platform } = res.locals;

      if (body) {
        body.sponsor.platform = {
          name: platform,
        };
      }

      const resp = await this.cashbackService.post(
        body,
        scopedApplicationToken,
        userToken,
      );

      if (resp?.response) {
        return next(resp);
      }

      return res.send(resp);
    } catch (error) {
      next(error);
    }
  }

  async put(req: Request, res: Response, next: NextFunction) {
    try {
      const { params: id } = req;
      const { scopedApplicationToken, userToken } = res.locals;

      await this.cashbackService.put(id, scopedApplicationToken, userToken);
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, params: id } = req;
      const { scopedApplicationToken, userToken } = res.locals;

      await this.cashbackService.patch(
        id,
        body,
        scopedApplicationToken,
        userToken,
      );
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentType }: paymentSlipCashbackActive = req.query;
      const { scopedApplicationToken, userToken } = res.locals;

      const campaign = await this.cashbackService.getActive(
        {
          paymentType,
        },
        scopedApplicationToken,
        userToken,
      );

      res.send(campaign);
    } catch (error) {
      next(error);
    }
  }

  async reschedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, params: id } = req;
      const { scopedApplicationToken, userToken } = res.locals;

      await this.cashbackService.reschedule(
        id,
        body,
        scopedApplicationToken,
        userToken,
      );
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
