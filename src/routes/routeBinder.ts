import { Application } from 'express';
import { Asteroid } from '../models';
import { ResourceRoute } from './resourceRoute';
import { OrderRoute } from './orderRoute';

export class RouteBinder {
  private app: Application;
  private resourceRoute: ResourceRoute;
  private OrderRoute: OrderRoute

  constructor(_app: Application, asteroids: Asteroid[]) {
    this.app = _app;
    this.resourceRoute = new ResourceRoute(asteroids);
    this.OrderRoute = new OrderRoute(asteroids)
    this.initRoute();
  }

  /**
   * Initializes the routes for the application.
   * Sets the base API path and binds resource routes.
   */
  public initRoute(): void {
    const prefix = '/api/v1/vh';

    this.app.use(prefix, this.resourceRoute.router);
    this.app.use(prefix, this.OrderRoute.router);
  }
}
