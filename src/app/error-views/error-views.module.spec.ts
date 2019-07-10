import { ErrorViewsModule } from './error-views.module';

describe('ErrorViewsModule', () => {
  let errorViewsModule: ErrorViewsModule;

  beforeEach(() => {
    errorViewsModule = new ErrorViewsModule();
  });

  it('should create an instance', () => {
    expect(errorViewsModule).toBeTruthy();
  });
});
